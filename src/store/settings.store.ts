import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	defaultSettingsValues,
	type SettingKey,
	type SettingsValues,
	settingsConfig,
} from "@/config/settings.config";
import { STORE_KEY } from "./constants";

interface SettingsState {
	settings: SettingsValues;
	updateSettings: (payload: { key: SettingKey; value: unknown }) => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			settings: { ...defaultSettingsValues },

			updateSettings: ({ key, value }) =>
				set((state) => {
					const declaration = settingsConfig[key];
					if (!declaration) return state;

					let processedValue: boolean | number;
					if (declaration.attributes.type === "checkbox") {
						processedValue = !(value === "true");
					} else if (declaration.type === "number") {
						processedValue = Number(value);
					} else {
						processedValue = value as boolean | number;
					}

					return {
						settings: {
							...state.settings,
							[key]: processedValue,
						},
					};
				}),
		}),
		{
			name: `${STORE_KEY}settings`,
			version: 3,
			migrate(persistedState, version) {
				if (version !== 3) {
					useSettingsStore.persist.clearStorage();
					return { settings: { ...defaultSettingsValues } } as SettingsState;
				}
				return persistedState as SettingsState;
			},
		},
	),
);
