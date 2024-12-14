import DeltaEnum from "@/enum/direction.enum";
import Colors from "@/lib/colors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLight } from "@/store/reducers/editor.reducer";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { memo, useCallback, useMemo } from "react";
import { twMerge } from "tailwind-merge";

function getRow(number) {
	if (number <= 0 || !Number.isInteger(number)) {
		return;
	}

	let column = "";
	while (number > 0) {
		const rest = (number - 1) % 26;
		column = String.fromCharCode(rest + 65) + column;
		number = Math.floor((number - rest - 1) / 26);
	}

	return column;
}

const Light = memo(({ isCurrent = false, disabled = false, row, column }) => {
	const dispatch = useAppDispatch();

	const selectedColor = useAppSelector((state) => state.editor.selectedColor);
	const light = useAppSelector((state) => state.editor.lights?.[row]?.[column]);

	const isOneColorPerColumn = useAppSelector(
		(state) => state.settings.oneColorPerColumn,
	);

	const handleClick = useCallback(
		(color) => {
			if (disabled) return;
			dispatch(updateLight({ row, column, color, isOneColorPerColumn }));
		},
		[dispatch, row, column, disabled, isOneColorPerColumn],
	);

	const rowName = useMemo(() => getRow(row + 1), [row]);
	const color = light?.color || "none";
	const angle = useMemo(
		() =>
			Object.values(DeltaEnum).find((d) => d.delta === light?.direction)?.angle,
		[light?.direction],
	);

	const onMouseInteract = useCallback(
		(e) => {
			e.preventDefault();
			if (e.buttons === 1) {
				handleClick(selectedColor);
			} else if (e.buttons === 2) {
				handleClick("none");
			}
		},
		[handleClick, selectedColor],
	);

	const onMouseRightClick = useCallback(
		(e) => {
			e.preventDefault();
			handleClick("none");
		},
		[handleClick],
	);

	return (
		<button
			type={"button"}
			className={twMerge(
				"group my-1 flex h-6 w-9 items-center justify-center rounded-md bg-gray-200/20 font-semibold text-gray-300/50 text-xs outline-none lg:h-5 lg:w-8",
				color !== "none" && Colors[color].editor?.default,
				isCurrent && color !== "none" && Colors[color].editor?.current,
			)}
			disabled={disabled}
			onContextMenu={onMouseRightClick}
			onMouseEnter={onMouseInteract}
			onMouseDown={onMouseInteract}
		>
			{!disabled && (
				<span
					className={`${row !== 0 && "hidden"} text-[10px] group-hover:block`}
				>
					<span className="hidden group-hover:inline-block">{rowName} </span>
					<span className="text-xs group-hover:text-[10px]">{column + 1}</span>
				</span>
			)}
			{disabled && typeof angle === "number" && (
				<span className="text-[10px]">
					<FontAwesomeIcon
						icon={faArrowUp}
						style={{
							transform: `rotate(${angle}deg)`,
						}}
					/>
				</span>
			)}
		</button>
	);
});

export default Light;
