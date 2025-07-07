import { useDrag } from "react-dnd";
import { twMerge } from "tailwind-merge";

export default function Separator({ uuid: id, x: itemX, moveSeparator }) {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "SEPARATOR",
		item: { id },
		end: (item, monitor) => {
			const delta = monitor.getDifferenceFromInitialOffset();
			if (!delta) return;

			const x = Math.round(itemX + delta.x);
			moveSeparator(item.id, x);
			return undefined;
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
			handlerId: monitor.getHandlerId(),
		}),
	}));

	return (
		<div
			ref={drag}
			className="separator fixed h-screen px-2"
			style={{ left: itemX }}
		>
			<div className={twMerge("h-[inherit] w-1 bg-white/60", (isDragging && "bg-red-500"))} />
		</div>
	);
}
