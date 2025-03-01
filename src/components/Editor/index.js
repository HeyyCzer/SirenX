import { useAppSelector } from "@/store/hooks";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import ColumnSettingsDropdown from "../ColumnSettingsDropdown";

const Light = dynamic(() => import("@/components/Light"), { ssr: false });

export default function Editor() {
	const { bpm } = useAppSelector((state) => state.editor);
	const { totalColumns } = useAppSelector((state) => state.settings);

	const [currentRow, setCurrentRow] = useState(0);
	useEffect(() => {
		const interval = setInterval(
			() => {
				setCurrentRow((prev) => (prev + 1) % 32);
			},
			1000 / (bpm / 60),
		);

		return () => clearInterval(interval);
	}, [bpm]);

	const editorColumns = useMemo(
		() => Array.from({ length: totalColumns.value }),
		[totalColumns.value],
	);
	const editorRows = useMemo(() => Array.from({ length: 32 }), []);

	return (
		<main className="mx-auto flex w-fit flex-col gap-y-6 overflow-x-auto">
			<div className="flex items-end gap-x-4">
				<Link
					href="/"
					className="upper w-fit font-bold text-2xl text-white leading-none"
				>
					Siren
					<span className="text-gradient-primary">X</span>
				</Link>

				<Link href="https://github.com/heyyczer/sirenx" passHref rel="noopener" target="_blank">
					<img
						src="https://img.shields.io/github/stars/heyyczer/sirenx"
						alt="Star"
						className="h-fit"
					/>
				</Link>
			</div>

			{/* Preview bar */}
			<div className="w-[inherit]">
				<div>
					<h2 className="text-center font-light text-gray-300/60 text-xs uppercase tracking-[2px]">
						Preview
					</h2>
				</div>
				<div className="flex gap-x-1 px-1">
					{editorColumns.map((_, columnIndex) => (
						<Light
							isCurrent
							key={`light-preview-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								columnIndex
							}`}
							disabled
							row={currentRow}
							column={columnIndex}
						/>
					))}
				</div>

				<hr className="mx-auto mt-2 w-1/2 border-gray-300/30" />
			</div>

			<div className="w-[inherit]">
				<div
					className={"flex w-[inherit] justify-around gap-x-1 rounded-lg px-1"}
				>
					{editorColumns.map((_, columnIndex) => (
						<ColumnSettingsDropdown
							key={`column-settings-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								columnIndex
							}`}
							columnIndex={columnIndex}
						/>
					))}
				</div>
				{editorRows.map((_, rowIndex) => (
					<div
						id={`light-row-${rowIndex}`}
						className={twMerge(
							"light-row",
							"flex w-[inherit] gap-x-1 rounded-lg px-1",
							rowIndex === currentRow && "bg-white/10",
						)}
						key={`light-row-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							rowIndex
						}`}
					>
						{editorColumns.map((_, columnIndex) => (
							<Light
								key={`light-${rowIndex}-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									columnIndex
								}`}
								row={rowIndex}
								column={columnIndex}
								isCurrent={rowIndex === currentRow}
							/>
						))}
					</div>
				))}
			</div>
		</main>
	);
}
