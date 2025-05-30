import { useEditorStore } from "@/store/editor.store.ts";
import { useSettingsStore } from "@/store/settings.store.ts";
import { useState } from "react";
import EditorGrid from "./EditorGrid";
import EditorHeader from "./EditorHeader";
import EditorPreview from "./EditorPreview";

export default function Editor() {
	const bpm = useEditorStore((state) => state.bpm);
	const totalColumns = useSettingsStore((state) => state.settings.totalColumns);
	const [currentRow, setCurrentRow] = useState(0);

	return (
		<main className="mx-auto flex w-fit flex-col gap-y-6 overflow-x-auto">
			<EditorHeader />
			<EditorPreview 
				totalColumns={totalColumns.value} 
				currentRow={currentRow} 
				setCurrentRow={setCurrentRow} 
				bpm={bpm} 
			/>
			<EditorGrid 
				totalColumns={totalColumns.value} 
				currentRow={currentRow} 
			/>
		</main>
	);
}
