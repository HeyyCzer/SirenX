import { useAppSelector } from "@/store/hooks";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SeparatorDropZone from "./dropZone";
import Separator from "./separator";

export default function SeparatorsContainer() {
	const settings = useAppSelector((state) => state.settings);
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
			if (!settings.separatorsVisible.value) return;
			if (document.querySelector("input:focus")) return;

			if (e.key === "q") {
				setSeparators(separators => [...separators, { id: uuidv4(), x: window.innerWidth / 2 }]);
			}
		}
		window.addEventListener("keyup", handleKeyup);
		
		return () => {
			window.removeEventListener("keyup", handleKeyup);
		}
	}, [settings.separatorsVisible.value]);

	return (
		<>
			{
				settings.separatorsVisible.value && (
					separators.map((separator) => (
						<Separator key={separator.id} uuid={separator.id} x={separator.x} moveSeparator={moveSeparator} />
					))
				)
			}

			<SeparatorDropZone removeSeparator={removeSeparator} />
		</>
	)
}