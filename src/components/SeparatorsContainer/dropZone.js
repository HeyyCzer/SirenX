import { useDrop } from "react-dnd";

export default function SeparatorDropZone({ removeSeparator }) {
	const [{ canDrop, isOver }, drop] = useDrop(() => ({
		accept: "SEPARATOR",
		drop(item) {
			removeSeparator(item.id);
			return undefined;
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	}));

	const isActive = canDrop && isOver;
	let backgroundColor = "#222";
	if (isActive) {
		backgroundColor = "darkgreen";
	} else if (canDrop) {
		backgroundColor = "darkkhaki";
	}

	return (
		<div ref={drop} className={`${canDrop ? "flex" : "hidden"} -translate-y-1/2 absolute top-1/2 left-0 h-1/2 w-8 items-center justify-center rounded-r-lg bg-red-500/10 text-center text-red-500 leading-none [writing-mode:vertical-lr]`}>
			<span className="rotate-180 text-sm uppercase tracking-widest">Delete separator</span>
		</div>
	);
}
