import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_KEY } from "./constants";

interface TutorialState {
	[key: string]: boolean | ((...args: any[]) => any);

	// Actions
	setStatus: (args: { key: string; value: boolean }) => void;
}

export const useTutorialStore = create<TutorialState>()(
	persist(
		(set) => ({
			// Actions
			setStatus: ({ key, value }) =>
				set(() => ({
					[key]: value,
				})),
		}),
		{
			name: `${STORE_KEY}tutorial`,
		}
	)
);
