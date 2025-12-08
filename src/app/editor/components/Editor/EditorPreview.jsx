import { useEffect, useMemo } from "react";
import Light from "../Light";

export default function EditorPreview({ totalColumns, currentRow, setCurrentRow, bpm }) {
  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentRow((prev) => (prev + 1) % 32);
      },
      1000 / (bpm / 60),
    );

    return () => clearInterval(interval);
  }, [bpm, setCurrentRow]);

  const editorColumns = useMemo(
    () => Array.from({ length: totalColumns }),
    [totalColumns]
  );
  return (
    <div className="w-[inherit]">
      <div className="mb-2 flex items-center justify-center gap-x-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
        <h2 className="font-light text-white/40 text-xs uppercase tracking-[3px]">
          Preview
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
      </div>
      <div className="flex gap-x-1 rounded-lg border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
        {editorColumns.map((_, columnIndex) => (
          <Light
            isCurrent
            // biome-ignore lint/suspicious/noArrayIndexKey: Índices são estáveis neste contexto
            key={`light-preview-${columnIndex}`}
            disabled
            row={currentRow}
            column={columnIndex}
          />
        ))}
      </div>
    </div>
  );
}
