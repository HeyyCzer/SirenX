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
      <div>
        <h2 className="text-center font-light text-gray-300/60 text-xs uppercase tracking-[2px]">
          Preview
        </h2>
      </div>
      <div className="flex gap-x-1 px-1">
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

      <hr className="mx-auto mt-2 w-1/2 border-gray-300/30" />
    </div>
  );
}
