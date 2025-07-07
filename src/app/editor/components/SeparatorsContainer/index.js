import { useSettingsStore } from "@/store/settings.store";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SeparatorDropZone from "./dropZone";
import Separator from "./separator";

export default function SeparatorsContainer() {
	const separatorsVisible = useSettingsStore((state) => state.settings.separatorsVisible);
	const [separators, setSeparators] = useState([]);

	const removeSeparator = useCallback((id) => {
		setSeparators(separators => separators.filter((separator) => separator.id !== id));
	}, []);

	const moveSeparator = useCallback((id, x) => {
		const separator = { ...(separators.find((separator) => separator.id === id)) };
		separator.x = x;
		separator.id = uuidv4();

		setSeparators([
			...separators.filter((separator) => separator.id !== id),
			separator,
		]);
	}, [separators]);

	useEffect(() => {
		const handleKeyup = (e) => {
			if (!separatorsVisible.value) return;
			if (document.querySelector("input:focus")) return;

			if (e.key === "q") {
				setSeparators(separators => [...separators, { id: uuidv4(), x: window.innerWidth / 2 }]);
			}
		}
		window.addEventListener("keyup", handleKeyup);
		
		return () => {
			window.removeEventListener("keyup", handleKeyup);
		}
	}, [separatorsVisible.value]);

	return (
		<>
			{
				separatorsVisible.value && (
					separators.map((separator) => (
						<Separator key={separator.id} uuid={separator.id} x={separator.x} moveSeparator={moveSeparator} />
					))
				)
			}

			<SeparatorDropZone removeSeparator={removeSeparator} />
		</>
	)
}
