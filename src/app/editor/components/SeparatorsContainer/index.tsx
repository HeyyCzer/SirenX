"use client";

import { useSettingsStore } from "@/store/settings.store";
import { useCallback, useEffect, useState } from "react";
import Separator from "./Separator";

interface SeparatorItem {
	id: string;
	x: number;
}

export default function SeparatorsContainer() {
	const separatorsVisible = useSettingsStore((state) => state.settings.separatorsVisible);
	const [separators, setSeparators] = useState<SeparatorItem[]>([]);

	const removeSeparator = useCallback((id: string) => {
		setSeparators((prev) => prev.filter((s) => s.id !== id));
	}, []);

	const moveSeparator = useCallback((id: string, x: number) => {
		setSeparators((prev) => prev.map((s) => s.id === id ? { ...s, x } : s));
	}, []);

	useEffect(() => {
		const handleKeyup = (e: KeyboardEvent) => {
			if (!separatorsVisible.value) return;
			if (document.querySelector("input:focus")) return;

			if (e.key === "q") {
				setSeparators((prev) => [...prev, { id: crypto.randomUUID(), x: window.innerWidth / 2 }]);
			}
		};
		window.addEventListener("keyup", handleKeyup);

		return () => {
			window.removeEventListener("keyup", handleKeyup);
		};
	}, [separatorsVisible.value]);

	if (!separatorsVisible.value) return null;

	return (
		<>
			{separators.map((separator) => (
				<Separator
					key={separator.id}
					uuid={separator.id}
					x={separator.x}
					moveSeparator={moveSeparator}
					removeSeparator={removeSeparator}
				/>
			))}
		</>
	);
}
