import { createCustomColor } from "@/services/color-manager.service";
import { useEditorStore } from "@/store/editor.store";
import { Suspense, useEffect, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useShallow } from "zustand/react/shallow";
import ColumnSettingsDropdown from "../ColumnSettingsDropdown";
import LightGroup from "../Light/LightGroup";

export default function EditorGrid({ totalColumns, currentRow }) {
	const editorColumns = useMemo(
		() => Array.from({ length: totalColumns }),
		[totalColumns],
	);

	const editorRows = useMemo(
		() => Array.from({ length: 32 }),
		[],
	);

	const lightRows = useEditorStore(
		useShallow((state) => state.lights),
	);
	useEffect(() => {
		if (!lightRows || lightRows.length === 0) return;

		for (const row of Object.values(lightRows)) {
			for (const light of Object.values(row)) {
				if (!light?.color.includes("CUSTOM_")) continue;
				
				createCustomColor(light.color.replace("CUSTOM_", ""));
			}
		}
	}, [lightRows]);

	return (
		<div className="w-[inherit] rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
			<div
				className={"flex w-[inherit] justify-around gap-x-1 rounded-lg px-1"}
			>
				{editorColumns.map((_, columnIndex) => (
					<ColumnSettingsDropdown
						// biome-ignore lint/suspicious/noArrayIndexKey: indexes are stable in this context
						key={`column-settings-${columnIndex}`}
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
					// biome-ignore lint/suspicious/noArrayIndexKey: indexes are stable in this context
					key={`light-row-${rowIndex}`}
				>
					<Suspense
						fallback={
							<div className="h-5 w-full animate-pulse bg-slate-800/30" />
						}
					>
						<LightGroup
							rowIndex={rowIndex}
							columns={editorColumns}
							currentRow={currentRow}
						/>
					</Suspense>
				</div>
			))}
		</div>
	);
}
