"use client";

import { faGripDotsVertical } from "@fortawesome/pro-regular-svg-icons";
import { faXmark } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface SeparatorProps {
	uuid: string;
	x: number;
	moveSeparator: (id: string, x: number) => void;
	removeSeparator: (id: string) => void;
}

export default function Separator({
	uuid: id,
	x: itemX,
	moveSeparator,
	removeSeparator,
}: SeparatorProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [currentX, setCurrentX] = useState(itemX);
	const dragRef = useRef<{
		mouseX: number;
		startX: number;
		hasMoved: boolean;
	} | null>(null);

	useEffect(() => {
		setCurrentX(itemX);
	}, [itemX]);

	useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (!dragRef.current) return;
			const delta = e.clientX - dragRef.current.mouseX;
			if (Math.abs(delta) > 2) dragRef.current.hasMoved = true;
			setCurrentX(dragRef.current.startX + delta);
		};

		const handleMouseUp = (e: MouseEvent) => {
			if (!dragRef.current) return;
			if (dragRef.current.hasMoved) {
				const delta = e.clientX - dragRef.current.mouseX;
				moveSeparator(id, dragRef.current.startX + delta);
			}
			dragRef.current = null;
			setIsDragging(false);
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, id, moveSeparator]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if ((e.target as HTMLElement).closest("[data-separator-delete]")) return;
		e.preventDefault();
		dragRef.current = { mouseX: e.clientX, startX: itemX, hasMoved: false };
		setIsDragging(true);
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: its ok
		<div
			className="separator fixed top-0 z-50 flex h-screen select-none flex-col items-center"
			style={{
				left: currentX,
				transform: "translateX(-50%)",
				cursor: isDragging ? "grabbing" : "grab",
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => {
				if (!isDragging) setIsHovered(false);
			}}
			onMouseDown={handleMouseDown}
		>
			{/* Handle with delete button */}
			<div className="relative mt-2 flex h-8 w-8 items-center justify-center">
				{/* Grip icon (background) */}
				<span
					className={twMerge(
						"absolute text-xs transition-opacity duration-150",
						isHovered || isDragging ? "opacity-0" : "text-white opacity-30",
					)}
				>
					<FontAwesomeIcon icon={faGripDotsVertical} />
				</span>

				{/* Delete button (shown on hover, hidden while dragging) */}
				<button
					type="button"
					data-separator-delete
					className={twMerge(
						"absolute flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-[.5rem] text-white transition-all duration-150 hover:bg-red-500",
						isHovered && !isDragging
							? "scale-100 opacity-100"
							: "pointer-events-none scale-75 opacity-0",
					)}
					onClick={(e) => {
						e.stopPropagation();
						removeSeparator(id);
					}}
					title="Delete separator"
				>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</div>

			{/* Separator line */}
			<div
				className={twMerge(
					"flex-1 transition-all duration-150",
					isDragging
						? "w-0.5 bg-emerald-400/80 shadow-[0_0_10px_2px_rgba(96,165,250,0.35)]"
						: "w-px",
					!isDragging && (isHovered ? "w-0.5 bg-white/85" : ""),
				)}
				style={
					!isDragging
						? {
								backgroundImage: isHovered
									? undefined
									: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 5px, transparent 5px, transparent 10px)",
								backgroundColor: isHovered
									? "rgba(255,255,255,0.5)"
									: "transparent",
							}
						: undefined
				}
			/>
		</div>
	);
}
