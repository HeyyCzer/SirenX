import DeltaEnum from '@/enum/direction.enum';
import ScaleFactorEnum from '@/enum/scaleFactor.enum';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { defaultLightModel, updateLights } from '@/lib/reducers/editor.reducer';
import { Modal } from '@/utils/modal';
import { faArrowUp, faCar, faChevronRight, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { memo, useCallback, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

const ColumnSettingsDropdown = ({ columnIndex }) => {
	const dispatch = useAppDispatch();
	const { lights } = useAppSelector((state) => state.editor);
	const data = useMemo(() => lights[0]?.[columnIndex] ?? defaultLightModel, [lights, columnIndex]);

	const handleChangeIntensity = useCallback(() => {
		Modal.fire({
			title: "Change intensity",
			text: "This will change the intensity of the light. The higher the number, the brighter the light will be. The lower the number, the dimmer the light will be. The value must be a number and greater than or equal to 0.",
			input: "text",
			inputLabel: "Intensity",
			inputValue: data.intensity,
			preConfirm: (value) => {
				if (!value || isNaN(value) || value < 0) {
					return Promise.reject("Invalid value");
				}
				return Promise.resolve(value);
			}
		}).then(({ isConfirmed, value }) => {
			if (!isConfirmed) return;

			const tempLights = JSON.parse(JSON.stringify(lights));
			for (const row of Object.values(tempLights)) {
				if (!row[columnIndex]) {
					row[columnIndex] = defaultLightModel;
				}
				row[columnIndex].intensity = value;
			}
			dispatch(updateLights(tempLights));
		});
	}, [dispatch, lights, columnIndex, data.intensity]);

	const handleChangeMultiples = useCallback(() => {
		Modal.fire({
			title: "Change multiples",
			text: "This will change the amount of flashes that a light will do in one \"beat\". The higher the number, the more flashes it will do. The value must be a number and greater than or equal to 1",
			input: "number",
			inputLabel: "Multiples",
			inputValue: data.multiples,
			inputAttributes: {
				min: 1,
				step: 1
			},
			showCancelButton: true,
			preConfirm: (value) => {
				if (!value || isNaN(value) || value <= 0 || !Number.isInteger(value)) {
					return Promise.reject("Invalid value");
				}
				return Promise.resolve(value);
			}
		}).then(({ isConfirmed, value }) => {
			if (!isConfirmed) return;

			const tempLights = JSON.parse(JSON.stringify(lights));
			for (const row of Object.values(tempLights)) {
				row[columnIndex].multiples = value;
			}
			dispatch(updateLights(tempLights));
		});
	}, [dispatch, lights, columnIndex, data.multiples]);

	const handleChangeScaleFactor = useCallback(async (scaleFactor) => {
		if (scaleFactor === "CUSTOM") {
			const { isConfirmed, value: inputValue } = await Modal.fire({
				title: "Custom scale factor",
				text: "This will change the scale factor of the light.",
				input: "number",
				inputLabel: "Scale Factor",
				inputValue: data.scaleFactor,
				showCancelButton: true,
				preConfirm: (value) => {
					if (!value || isNaN(value) || value <= 0 || !Number.isInteger(value)) {
						return Promise.reject("Invalid value");
					}
					return Promise.resolve(value);
				}
			});

			if (!isConfirmed) return;

			scaleFactor = inputValue;
		}

		const tempLights = JSON.parse(JSON.stringify(lights));
		for (const row of Object.values(tempLights)) {
			if (!row[columnIndex]) {
				row[columnIndex] = defaultLightModel;
			}
			row[columnIndex].scaleFactor = scaleFactor;
		}
		dispatch(updateLights(tempLights));
	}, [dispatch, lights, columnIndex, data.scaleFactor]);

	const handleChangeDirection = useCallback(async (delta) => {
		if (delta === "CUSTOM") {
			const { isConfirmed, value: inputValue } = await Modal.fire({
				title: "Custom direction",
				text: "This will change the direction of the light.",
				input: "text",
				inputLabel: "Delta",
				inputValue: data.direction,
				preConfirm: (value) => {
					if (!value || isNaN(value) || value < 0) {
						return Promise.reject("Invalid value");
					}
					return Promise.resolve(value);
				}
			});

			if (!isConfirmed) return;

			delta = Number(inputValue);
		}

		const tempLights = JSON.parse(JSON.stringify(lights));
		for (const row of Object.values(tempLights)) {
			if (!row[columnIndex]) {
				row[columnIndex] = defaultLightModel;
			}
			row[columnIndex].direction = delta;
		}
		dispatch(updateLights(tempLights));
	}, [dispatch, lights, columnIndex, data.direction]);

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button className="text-gray-400 text-xs sm:text-sm w-9 lg:w-8" id={`settings-dropdown-${columnIndex}`}>
					<FontAwesomeIcon icon={faGear} />
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="min-w-[220px] bg-slate-800 rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
					sideOffset={5}
				>
					<DropdownMenu.Item
						className="group text-[13px] leading-none text-gray-200 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-600/50 data-[highlighted]:text-white"
						onSelect={handleChangeIntensity}
					>
						Change Intensity
					</DropdownMenu.Item>
					<DropdownMenu.Item
						className="group text-[13px] leading-none text-gray-200 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-600/50 data-[highlighted]:text-white"
						onSelect={handleChangeMultiples}
					>
						Change Multiples
					</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger className="group text-[13px] leading-none text-gray-200 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-slate-600/80 data-[state=open]:text-gray-200 data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-600/50 data-[highlighted]:text-white data-[highlighted]:data-[state=open]:bg-slate-600/50 data-[highlighted]:data-[state=open]:text-white">
							Change Scale Factor
							<div className="ml-auto pl-[20px] text-gray-400 group-data-[highlighted]:text-white group-data-[disabled]:text-gray-400">
								<FontAwesomeIcon icon={faChevronRight} />
							</div>
						</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent
								className="ml-1 min-w-[220px] bg-slate-800 rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
								sideOffset={2}
								alignOffset={-5}
							>
								{
									Object.entries(ScaleFactorEnum).map(([id, scaleData]) => (
										<DropdownMenu.Item
											key={`scalefactor-${id}-${columnIndex}`}
											onSelect={() => handleChangeScaleFactor(scaleData.value)}
											className={twMerge("group text-[13px] leading-none text-gray-200 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-600/50 data-[highlighted]:text-white", ((data.scaleFactor === scaleData.value) && "bg-emerald-400/30 text-emerald-400 data-[highlighted]:bg-emerald-400/20 data-[highlighted]:text-emerald-500"))}
										>
											{scaleData.name}
											<span className="text-gray-400 ml-auto mr-2">
												({scaleData.value})
											</span>
										</DropdownMenu.Item>
									))
								}
								<DropdownMenu.Item
									onSelect={() => handleChangeScaleFactor("CUSTOM")}
									className={twMerge("group text-[13px] leading-none text-gray-200 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-600/50 data-[highlighted]:text-white", !Object.values(ScaleFactorEnum).map(d => d.value).includes(data.scaleFactor) && "bg-emerald-400/30 text-emerald-400 data-[highlighted]:bg-emerald-400/20 data-[highlighted]:text-emerald-500")}
								>
									Custom...
								</DropdownMenu.Item>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger className="group text-[13px] leading-none text-gray-200 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-slate-600/80 data-[state=open]:text-gray-200 data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-600/50 data-[highlighted]:text-white data-[highlighted]:data-[state=open]:bg-slate-600/50 data-[highlighted]:data-[state=open]:text-white">
							Change Direction
							<div className="ml-auto pl-[20px] text-gray-400 group-data-[highlighted]:text-white group-data-[disabled]:text-gray-400">
								<FontAwesomeIcon icon={faChevronRight} />
							</div>
						</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent
								className="ml-1 min-w-[220px] bg-slate-800 rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade overflow-y-auto max-h-[500px]"
								sideOffset={2}
								alignOffset={-5}
							>
								{
									Object.entries(DeltaEnum).map(([id, directionData]) => (
										<DropdownMenu.Item
											key={`direction-${id}-${columnIndex}`}
											onSelect={() => handleChangeDirection(directionData.delta)}
											className={twMerge("group text-[13px] leading-none text-gray-200 rounded-[3px] py-1 px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-600/50 data-[highlighted]:text-white", ((data.direction === directionData.delta) && "bg-emerald-400/30 text-emerald-400 data-[highlighted]:bg-emerald-400/20 data-[highlighted]:text-emerald-500"))}
										>
											<div className="flex items-center">
												{directionData.name}
												<span className="text-gray-400 ml-auto mr-2">
													({directionData.angle}°)
												</span>
											</div>
											<div className="mt-1.5 flex flex-col gap-y-1">
												{
													directionData.schema.map((row, rowIndex) => (
														<div key={`direction-${id}-${columnIndex}-row-${rowIndex}`} className="flex gap-x-1">
															{
																row.map((cell, cellIndex) => (
																	<div key={`direction-${id}-${columnIndex}-${rowIndex}-${cellIndex}`} className="flex w-6 h-6 items-center justify-center rounded-md bg-gray-200/20">
																		{cell === "CENTER" && (
																			<FontAwesomeIcon icon={faCar} />
																		)}
																		{cell === true && (
																			<FontAwesomeIcon icon={faArrowUp} style={{
																				transform: `rotate(${directionData.angle}deg)`
																			}} />
																		)}
																	</div>
																))
															}
														</div>
													))
												}
											</div>
										</DropdownMenu.Item>
									))
								}
								<DropdownMenu.Item
									onSelect={() => handleChangeDirection("CUSTOM")}
									className={twMerge("group text-[13px] leading-none text-gray-200 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-600/50 data-[highlighted]:text-white", !Object.values(DeltaEnum).map(d => d.delta).includes(data.direction) && "bg-emerald-400/30 text-emerald-400 data-[highlighted]:bg-emerald-400/20 data-[highlighted]:text-emerald-500")}
								>
									Custom...
								</DropdownMenu.Item>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
};

export default memo(ColumnSettingsDropdown);