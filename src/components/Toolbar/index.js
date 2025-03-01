import { downloadFile, uploadFile } from "@/controllers/file.controller";
import { event } from "@/gtag";
import Colors from "@/lib/colors";
import { STORE_KEY } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	setCurrentBpm,
	setSelectedColor,
	setUploadData,
	updateLights,
} from "@/store/reducers/editor.reducer";
import { updateSettings } from "@/store/reducers/settings.reducer";
import { setSponsorLastSeen } from "@/store/reducers/sponsor.reducer";
import { Modal } from "@/utils/modal";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Sentry from "@sentry/nextjs";
import {
	useCallback,
	useEffect,
	useRef,
	useState
} from "react";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import SponsorModal from "../SponsorModal";

export default function Toolbar() {
	const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

	const dispatch = useAppDispatch();
	const { selectedColor, bpm, lights, sirenId, sirenName, uploadedFile } =
		useAppSelector((state) => state.editor);
	const settings = useAppSelector((state) => state.settings);
	const sponsor = useAppSelector((state) => state.sponsor);

	const [colors] = useState(Colors);
	
	const hiddenFileInput = useRef(null);

	useEffect(() => {
		const handleKeypress = (e) => {
			if (document.querySelector("input:focus")) return;

			const key = e.key;
			if (Number.isNaN(key)) return;

			const colorName = Object.keys(Colors)[Number.parseInt(key) - 1];
			if (
				colorName &&
				selectedColor !== colorName &&
				!colors[colorName].toolbar.unlisted
			) {
				dispatch(setSelectedColor(colorName));
			}
		};
		window.addEventListener("keypress", handleKeypress);

		return () => {
			window.removeEventListener("keypress", handleKeypress);
		};
	}, [dispatch, selectedColor, colors]);

	const handleFileUpload = useCallback(
		(e) => {
			const file = e.target.files[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = async (e) => {
				const content = e.target.result;

				Sentry.addBreadcrumb({
					category: "file",
					message: "Requesting file import",
					level: "info",
				});

				hiddenFileInput.current.value = null;

				const result = await uploadFile(content);
				if (!result) {
					Sentry.addBreadcrumb({
						category: "file",
						message: "The imported file is invalid",
						level: "warning",
					});
					return;
				}

				dispatch(updateLights(result.lights));

				const minimumColumns = 20;
				const totalColumns = Math.max(
					result.lights?.[0]?.length,
					minimumColumns,
				);
				dispatch(
					updateSettings({
						key: "totalColumns",
						value: totalColumns,
					}),
				);

				event({
					action: "file_import",
					category: "editor",
					label: `${totalColumns} columns - ${result.bpm} BPM`,
				});

				dispatch(setCurrentBpm(result.bpm));
				dispatch(
					setUploadData({
						id: result.id,
						name: result.name,
						file: result.file,
					}),
				);

				Sentry.addBreadcrumb({
					category: "file",
					message: "File imported!",
					level: "info",
				});

				window.location.reload();
			};
			reader.readAsText(file);
		},
		[dispatch],
	);

	const handleDownloadFile = useCallback(() => {
		Modal.fire({
			title: "Enter the Siren ID",
			input: "number",
			inputAttributes: {
				min: 100,
				max: 99999,
			},
			inputValue: sirenId,
			inputPlaceholder: "Siren ID",
			showCancelButton: true,
			preConfirm: (newSirenId) => {
				if (!newSirenId)
					return Modal.showValidationMessage("Please, enter a Siren ID.");
				return newSirenId;
			},
		}).then(({ isConfirmed, value: newSirenId }) => {
			if (!isConfirmed || !newSirenId) return;

			Modal.fire({
				title: "Enter the Siren Name",
				input: "text",
				inputValue: sirenName,
				inputPlaceholder: "Siren name",
				showCancelButton: true,
				preConfirm: (newSirenName) => {
					if (!newSirenName)
						return Modal.showValidationMessage("Please, enter a Siren Name.");
					return newSirenName;
				},
			}).then(({ isConfirmed, value: newSirenName }) => {
				if (!isConfirmed || !newSirenName) return;

				Sentry.addBreadcrumb({
					category: "file",
					message: "Requesting file export",
					level: "info",
				});

				const [fileContent, jsonFileContent] = downloadFile(
					{
						sirenId,
						newSirenId,
						newSirenName,
						uploadedFile,
						lights,
						bpm,
					},
					settings,
					`${uuidv4()}.meta`,
				);
				if (!fileContent) return;

				event({
					action: "file_export",
					category: "editor",
					label: `${settings.totalColumns.value} columns - ${bpm} BPM`,
				});

				dispatch(
					setUploadData({
						id: newSirenId,
						name: newSirenName,
						file: jsonFileContent,
					}),
				);

				if (
					!sponsor.lastSeen ||
					Date.now() - sponsor.lastSeen > 15 * 24 * 60 * 60 * 1000
				) {
					setIsSponsorModalOpen(true);
					dispatch(setSponsorLastSeen(Date.now()));
				}

				Sentry.addBreadcrumb({
					category: "file",
					message: "File exported!",
					level: "info",
				});
			});
		});
	}, [
		dispatch,
		lights,
		sponsor,
		sirenId,
		sirenName,
		bpm,
		settings,
		uploadedFile,
	]);

	const handleResetEditor = useCallback(() => {
		Modal.fire({
			icon: "warning",
			title: "Reset editor",
			text: "Are you sure you want to reset the editor? This action cannot be undone.",
			showCancelButton: true,
		}).then(({ isConfirmed }) => {
			if (!isConfirmed) return;

			Modal.fire({
				icon: "success",
				title: "Editor reset",
				text: "The editor has been reset successfully. You can now start a new project.",
				showConfirmButton: false,
				timer: 1500,
				timerProgressBar: true,
			}).then(() => {
				localStorage.removeItem(`${STORE_KEY}editor`);
				window.location.reload();
			});
		});
	}, []);

	const handleUpdateBPM = useCallback(
		(e) => {
			const target = e.target;
			if (!target) return;

			let value = target.value;
			if (value < 0) value = 0;

			target.value = value;

			dispatch(setCurrentBpm(target.value));
		},
		[dispatch],
	);

	return (
		<>
			<SponsorModal
				isOpen={isSponsorModalOpen}
				closeModal={() => setIsSponsorModalOpen(false)}
			/>

			<aside
				id="toolbar"
				className="mt-14 flex w-full min-w-[250px] max-w-[300px] flex-col gap-y-5 rounded-xl bg-slate-900 px-6 pb-6 drop-shadow-lg"
			>
				<input
					type="file"
					ref={hiddenFileInput}
					className="hidden"
					accept=".meta"
					onChange={handleFileUpload}
				/>

				<div className="flex justify-center py-6 font-medium text-white uppercase">
					<h1>Tool</h1>
					<h1 className="font-semibold text-gradient-primary">Box</h1>
				</div>

				<div className="flex flex-col gap-y-1.5">
					<button
						type="button"
						id="toolbar-import"
						className="w-full rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 py-1 font-semibold text-sm text-white uppercase tracking-[2px]"
						onClick={() => hiddenFileInput.current.click()}
					>
						Import
					</button>
					<button
						type="button"
						id="toolbar-export"
						disabled={!settings.oneColorPerColumn.value}
						className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 py-1 font-semibold text-sm text-white uppercase tracking-[2px] disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-500 disabled:text-gray-400"
						onClick={handleDownloadFile}
					>
						Export
					</button>
					<button
						type="button"
						id="toolbar-reset"
						className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-800 py-1 font-semibold text-sm text-white uppercase tracking-[2px]"
						onClick={handleResetEditor}
					>
						Reset editor
					</button>
				</div>

				{/* BPM */}
				<div>
					<h2 className="text-center text-sm text-white uppercase tracking-[2px]">
						Adjust BPM
					</h2>

					<div id="toolbar-bpm" className="mt-2 flex flex-col items-center">
						<input
							type="range"
							min="10"
							max="1200"
							step="10"
							className="w-full accent-emerald-400"
							value={bpm}
							onChange={handleUpdateBPM}
						/>
						<span className="mt-1 flex items-center gap-x-2 text-white text-xs">
							Current BPM:
							<input
								type="number"
								className="border-0 border-white/30 border-b-2 bg-transparent px-0 py-0 text-center text-white proportional-nums outline-none transition-all [appearance:textfield] focus:border-emerald-400 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								value={bpm}
								onChange={handleUpdateBPM}
							/>
						</span>
					</div>
				</div>

				{/* COLORS */}
				<div>
					<h2 className="text-center text-sm text-white uppercase tracking-[2px]">
						Siren Colors
					</h2>

					<div
						id="toolbar-colors"
						className="mt-4 grid w-full grid-cols-3 gap-y-2"
					>
						{Object.entries(colors)
							.filter(([, colorData]) => !colorData.toolbar.unlisted)
							.map(([color, colorData], index) => {
								const selected = selectedColor === color;
								return (
									<div
										key={color}
										className="flex flex-col items-center text-white text-xs"
									>
										<button
											type="button"
											className={`relative ${selected ? colorData.toolbar.selected : colorData.toolbar.default} mx-auto flex aspect-square w-12 items-center justify-center rounded-lg transition-all`}
											onClick={() => dispatch(setSelectedColor(color))}
										>
											{selected && (
												<FontAwesomeIcon
													icon={faCheck}
													className="text-2xl drop-shadow-[0px_2px_1px_#000]"
												/>
											)}

											{!selected && (
												<span className="absolute bottom-0.5 left-1 text-xs">
													{index + 1}
												</span>
											)}
										</button>
										{colorData.toolbar.name}
									</div>
								);
							})}
					</div>
				</div>

				{/* SETTINGS */}
				<div>
					<h2 className="text-center text-sm text-white uppercase tracking-[2px]">
						Settings
					</h2>

					<div
						id="toolbar-settings"
						className="mt-4 flex flex-col gap-y-2 text-gray-300 text-xs"
					>
						{Object.entries(settings)
							.filter(([, settingsData]) => !settingsData.unlisted)
							.map(([settingsId, settingsData]) => (
								<div key={settingsId} className="flex flex-col gap-y-1">
									<div className="flex items-center justify-between gap-x-2">
										<input
											className={twMerge(
												"mt-1 rounded-md text-emerald-400 accent-emerald-400 outline-none focus:ring-0",
												settingsData.attributes?.type === "range" && "w-full",
											)}
											id={`settings-${settingsId}`}
											checked={settingsData.value}
											value={settingsData.value}
											onChange={(e) =>
												dispatch(
													updateSettings({
														key: settingsId,
														value: e.target.value,
													}),
												)
											}
											{...(settingsData.attributes ?? {})}
										/>
										{settingsData.attributes?.type === "range" && (
											<span className="text-white text-xs">
												{settingsData.value}
											</span>
										)}
									</div>
									<label htmlFor={`settings-${settingsId}`}>
										<h5 className="font-semibold text-sm text-white">
											{settingsData.label}
										</h5>
										{settingsData.description && (
											<p>{settingsData.description}</p>
										)}
										{settingsData.negativeEffect && (
											<p className="text-amber-500">
												{settingsData.negativeEffect}
											</p>
										)}
									</label>
								</div>
							))}
					</div>
				</div>

				{/* KEYBINDS */}
				<div>
					<h2 className="text-center text-sm text-white uppercase tracking-[2px]">
						Useful keybinds
					</h2>

					<div
						id="toolbar-keybinds"
						className="mt-4 flex flex-col gap-y-2 text-gray-300 text-xs"
					>
						<div className="grid grid-cols-2 items-center gap-x-2">
							<kbd>
								<kbd>Mouse Left</kbd>
							</kbd>
							<p>Draw color</p>
						</div>
						<div className="grid grid-cols-2 items-center gap-x-2">
							<kbd>
								<kbd>Mouse Right</kbd>
							</kbd>
							<p>Erase color</p>
						</div>
						<div className="grid grid-cols-2 items-center gap-x-2">
							<kbd>
								<kbd>0-9</kbd>
							</kbd>
							<p>Change color</p>
						</div>
						<div className="grid grid-cols-2 items-center gap-x-2">
							<kbd>
								<kbd>Q</kbd>
							</kbd>
							<p>Create separator</p>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
}
