import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_KEY } from "./constants";

interface SponsorState {
	lastSeen?: number;
}

export const useSponsorStore = create<SponsorState>()(
	persist(
		(set) => ({
			lastSeen: undefined,

			// Actions
			setSponsorLastSeen: (value: number) => set({ lastSeen: value }),
		}),
		{
			name: `${STORE_KEY}sponsor`,
		}
	)
);
