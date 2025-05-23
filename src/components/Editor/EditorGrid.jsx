import { Suspense, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import ColumnSettingsDropdown from "../ColumnSettingsDropdown";
import LightGroup from "./LightGroup";

export default function EditorGrid({ totalColumns, currentRow }) {
	const editorColumns = useMemo(
		() => Array.from({ length: totalColumns }),
		[totalColumns],
	);

	// Vamos renderizar apenas um conjunto de linhas visíveis por vez para reduzir o impacto inicial
	const [visibleRows, setVisibleRows] = useState(8);
	const editorRows = useMemo(
		() => Array.from({ length: Math.min(visibleRows, 32) }),
		[visibleRows],
	);

	// Aumentar o número de linhas visíveis gradualmente
	useEffect(() => {
		if (visibleRows < 32) {
			const timer = setTimeout(() => {
				setVisibleRows((prev) => Math.min(prev + 8, 32));
			}, 150);
			return () => clearTimeout(timer);
		}
	}, [visibleRows]);

	return (
		<div className="w-[inherit]">
			<div
				className={"flex w-[inherit] justify-around gap-x-1 rounded-lg px-1"}
			>
				{editorColumns.map((_, columnIndex) => (
					<ColumnSettingsDropdown
						// biome-ignore lint/suspicious/noArrayIndexKey: Índices são estáveis neste contexto
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
					// biome-ignore lint/suspicious/noArrayIndexKey: Índices são estáveis neste contexto
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
