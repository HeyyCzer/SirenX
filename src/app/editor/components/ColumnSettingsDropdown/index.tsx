import { faArrowUp, faCar, faGear } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useCallback, useMemo } from "react";
import { activeItemCn, Dropdown } from "@/components/Dropdown";
import DeltaEnum from "@/enum/direction.enum";
import ScaleFactorEnum from "@/enum/scaleFactor.enum";
import { defaultLightModel } from "@/store/constants";
import { useEditorStore } from "@/store/editor.store";
import { useSettingsStore } from "@/store/settings.store";
import { Modal } from "@/utils/modal";

type Lights = Record<string, Record<string, typeof defaultLightModel>>;

function applyToColumn<K extends keyof typeof defaultLightModel>(
	lights: Lights,
	columnIndex: number,
	field: K,
	value: (typeof defaultLightModel)[K],
): Lights {
	const clone = JSON.parse(JSON.stringify(lights)) as Lights;
	for (const row of Object.values(clone)) {
		if (!row[columnIndex])
			row[columnIndex] = JSON.parse(JSON.stringify(defaultLightModel));
		row[columnIndex][field] = value;
	}
	return clone;
}

const scaleFactorValues = Object.values(ScaleFactorEnum).map((d) => d.value);
const deltaValues = Object.values(DeltaEnum).map((d) => d.delta);

const ColumnSettingsDropdown = ({ columnIndex }: { columnIndex: number }) => {
	const lights = useEditorStore((state) => state.lights);
	const updateLights = useEditorStore((state) => state.updateLights);
	const totalRows = useSettingsStore(
		(state) => state.settings.totalRows as number,
	);
	const data = useMemo(
		() =>
			lights[0]?.[columnIndex] ?? JSON.parse(JSON.stringify(defaultLightModel)),
		[lights, columnIndex],
	);

	const handleChangeIntensity = useCallback(() => {
		Modal.fire({
			title: "Change intensity",
			text: "This will change the intensity of the light. The higher the number, the brighter the light will be. The lower the number, the dimmer the light will be. The value must be a number and greater than or equal to 0.",
			input: "text",
			inputLabel: "Intensity",
			inputValue: data.intensity,
			preConfirm: (valueStr) => {
				const value = Number(valueStr);
				if (!value || Number.isNaN(value) || value < 0)
					return Modal.showValidationMessage("Invalid value");
				return value;
			},
		}).then(({ isConfirmed, value }) => {
			if (!isConfirmed) return;
			updateLights(applyToColumn(lights, columnIndex, "intensity", value));
		});
	}, [updateLights, lights, columnIndex, data.intensity]);

	const handleChangeMultiples = useCallback(() => {
		Modal.fire({
			title: "Change multiples",
			text: 'This will change the amount of flashes that a light will do in one "beat". The higher the number, the more flashes it will do. The value must be a number and greater than or equal to 1',
			input: "number",
			inputLabel: "Multiples",
			inputValue: data.multiples,
			inputAttributes: { min: "1", step: "1" },
			showCancelButton: true,
			preConfirm: (valueStr) => {
				const value = Number(valueStr);
				if (
					!value ||
					Number.isNaN(value) ||
					value <= 0 ||
					!Number.isInteger(value)
				)
					return Modal.showValidationMessage("Invalid value");
				return value;
			},
		}).then(({ isConfirmed, value }) => {
			if (!isConfirmed) return;
			updateLights(applyToColumn(lights, columnIndex, "multiples", value));
		});
	}, [updateLights, lights, columnIndex, data.multiples]);

	const handleChangeScaleFactor = useCallback(
		async (choosenScaleFactor: "CUSTOM" | number) => {
			let scaleFactor: number;

			if (choosenScaleFactor === "CUSTOM") {
				const { isConfirmed, value: inputValue } = await Modal.fire({
					title: "Custom scale factor",
					text: "This will change the scale factor of the light.",
					input: "number",
					inputLabel: "Scale Factor",
					inputValue: data.scaleFactor,
					inputAttributes: { min: "0", step: "any" },
					showCancelButton: true,
					preConfirm: (valueStr) => {
						const value = Number(valueStr);
						if (!value || Number.isNaN(value) || value <= 0)
							return Modal.showValidationMessage("Invalid value");
						return value;
					},
				});
				if (!isConfirmed) return;
				scaleFactor = inputValue;
			} else {
				scaleFactor = choosenScaleFactor;
			}

			updateLights(
				applyToColumn(lights, columnIndex, "scaleFactor", scaleFactor),
			);
		},
		[updateLights, lights, columnIndex, data.scaleFactor],
	);

	const getSequencerBinary = useCallback(
		() =>
			Array.from({ length: totalRows }, (_, rowIndex) => {
				const color = lights[rowIndex]?.[columnIndex]?.color;
				return color && color !== "none" ? "1" : "0";
			}).join(""),
		[lights, columnIndex, totalRows],
	);

	const handleCopySequencersBinary = useCallback(() => {
		navigator.clipboard.writeText(getSequencerBinary());
	}, [getSequencerBinary]);

	const handleCopySequencersDecimal = useCallback(() => {
		navigator.clipboard.writeText(
			Number.parseInt(getSequencerBinary(), 2).toString(),
		);
	}, [getSequencerBinary]);

	const handleChangeDirection = useCallback(
		async (choosenDelta: "CUSTOM" | number) => {
			let delta: number;

			if (choosenDelta === "CUSTOM") {
				const { isConfirmed, value: inputValue } = await Modal.fire({
					title: "Custom direction",
					text: "This will change the direction of the light.",
					input: "text",
					inputLabel: "Delta",
					inputValue: data.direction,
					preConfirm: (valueStr) => {
						const value = Number(valueStr);
						if (!value || Number.isNaN(value))
							return Modal.showValidationMessage("Invalid value");
						return value;
					},
				});
				if (!isConfirmed) return;
				delta = Number(inputValue);
			} else {
				delta = choosenDelta;
			}

			updateLights(applyToColumn(lights, columnIndex, "direction", delta));
		},
		[updateLights, lights, columnIndex, data.direction],
	);

	return (
		<Dropdown.Root>
			<Dropdown.Trigger asChild>
				<button
					type="button"
					className="w-9 text-gray-400 text-xs outline-none transition-colors hover:text-gray-200 sm:text-sm lg:w-8"
					id={`settings-dropdown-${columnIndex}`}
					data-testid="column-settings-dropdown"
				>
					<FontAwesomeIcon icon={faGear} />
				</button>
			</Dropdown.Trigger>

			<Dropdown.Portal>
				<Dropdown.Content sideOffset={5}>
					<Dropdown.Sub>
						<Dropdown.SubTrigger>Copy Sequencers</Dropdown.SubTrigger>
						<Dropdown.Portal>
							<Dropdown.SubContent sideOffset={2} alignOffset={-5}>
								<Dropdown.Item onSelect={handleCopySequencersBinary}>
									Copy as Binary
								</Dropdown.Item>
								<Dropdown.Item onSelect={handleCopySequencersDecimal}>
									Copy as Decimal
								</Dropdown.Item>
							</Dropdown.SubContent>
						</Dropdown.Portal>
					</Dropdown.Sub>

					<Dropdown.Separator className="m-[5px] h-px bg-slate-600" />

					<Dropdown.Item onSelect={handleChangeIntensity}>
						Change Intensity
					</Dropdown.Item>
					<Dropdown.Item onSelect={handleChangeMultiples}>
						Change Multiples
					</Dropdown.Item>

					<Dropdown.Sub>
						<Dropdown.SubTrigger>Change Scale Factor</Dropdown.SubTrigger>
						<Dropdown.Portal>
							<Dropdown.SubContent sideOffset={2} alignOffset={-5}>
								{Object.entries(ScaleFactorEnum).map(([id, scaleData]) => (
									<Dropdown.Item
										key={`scalefactor-${id}-${columnIndex}`}
										onSelect={() => handleChangeScaleFactor(scaleData.value)}
										className={
											data.scaleFactor === scaleData.value
												? activeItemCn
												: undefined
										}
									>
										{scaleData.name}
										<span className="mr-2 ml-auto text-gray-400">
											({scaleData.value})
										</span>
									</Dropdown.Item>
								))}
								<Dropdown.Item
									onSelect={() => handleChangeScaleFactor("CUSTOM")}
									className={
										!scaleFactorValues.includes(data.scaleFactor)
											? activeItemCn
											: undefined
									}
								>
									Custom...
								</Dropdown.Item>
							</Dropdown.SubContent>
						</Dropdown.Portal>
					</Dropdown.Sub>

					<Dropdown.Sub>
						<Dropdown.SubTrigger>Change Direction</Dropdown.SubTrigger>
						<Dropdown.Portal>
							<Dropdown.SubContent
								className="max-h-[500px] overflow-y-auto"
								sideOffset={2}
								alignOffset={-5}
							>
								{Object.entries(DeltaEnum).map(([id, directionData]) => (
									<Dropdown.BlockItem
										key={`direction-${id}-${columnIndex}`}
										onSelect={() => handleChangeDirection(directionData.delta)}
										className={
											data.direction === directionData.delta
												? activeItemCn
												: undefined
										}
									>
										<div className="flex items-center">
											{directionData.name}
											<span className="mr-2 ml-auto text-gray-400">
												({directionData.angle}°)
											</span>
										</div>
										<div className="mt-1.5 flex flex-col gap-y-1">
											{directionData.schema.map((row, rowIndex) => (
												<div
													// biome-ignore lint/suspicious/noArrayIndexKey: ok here
													key={`direction-${id}-${columnIndex}-row-${rowIndex}`}
													className="flex gap-x-1"
												>
													{row.map((cell, cellIndex) => (
														<div
															// biome-ignore lint/suspicious/noArrayIndexKey: ok here
															key={`direction-${id}-${columnIndex}-${rowIndex}-${cellIndex}`}
															className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-200/20"
														>
															{cell === "CENTER" && (
																<FontAwesomeIcon icon={faCar} />
															)}
															{cell === true && (
																<FontAwesomeIcon
																	icon={faArrowUp}
																	style={{
																		transform: `rotate(${directionData.angle}deg)`,
																	}}
																/>
															)}
														</div>
													))}
												</div>
											))}
										</div>
									</Dropdown.BlockItem>
								))}
								<Dropdown.Item
									onSelect={() => handleChangeDirection("CUSTOM")}
									className={
										!deltaValues.includes(data.direction)
											? activeItemCn
											: undefined
									}
								>
									Custom...
								</Dropdown.Item>
							</Dropdown.SubContent>
						</Dropdown.Portal>
					</Dropdown.Sub>
				</Dropdown.Content>
			</Dropdown.Portal>
		</Dropdown.Root>
	);
};

export default memo(ColumnSettingsDropdown);
