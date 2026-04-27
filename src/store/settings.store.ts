import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_KEY } from "./constants";


export const useSettingsStore = create<any>()(
	persist(
		(set) => ({
			settings: {
				separatorsVisible: {
					label: "Show/hide separators",
					description: "This will show the created separators.",
					attributes: {
						type: "checkbox",
					},
					type: "boolean",
					value: true,
				},
				oneColorPerColumn: {
					label: "Limit one color per column",
					description: "This is useful for visualizing your pattern.",
					negativeEffect: "By disabling this, you will not be able to export files.",
					attributes: {
						type: "checkbox",
					},
					type: "boolean",
					value: true,
				},
				totalColumns: {
					label: "Total of columns",
					description: "This is the total columns of the editor. Default is 20.",
					attributes: {
						type: "range",
						min: 1,
						max: 50,
					},
					type: "number",
					value: 20,
				},
				totalRows: {
					label: "Total of rows",
					description: "This is the total rows of the editor. Default is 32.",
					negativeEffect: "By changing this from 32, you will not be able to export files.",
					attributes: {
						type: "range",
						min: 1,
						max: 100,
					},
					type: "number",
					value: 32,
				},
			},

			// Actions
			// TODO: Add types to the actions
			updateSettings: ({ key, value }: any) =>
				set((state: any) => {
					let processedValue = value;

					if (state.settings[key].attributes?.type === "checkbox") {
						processedValue = !(value === "true");
					}

					if (state.settings[key].type === "number") {
						processedValue = Number(value);
					}

					return {
						settings: {
							...state.settings,
							[key]: {
								...state.settings[key],
								value: processedValue,
							},
						},
					}
				}),
		}),
		{
			name: `${STORE_KEY}settings`,
			version: 2,
			migrate(persistedState, version) {
				if (version !== 2) {
					useSettingsStore.persist.clearStorage();
					return {} as any; // Return an empty state to reset to defaults
				}
				return persistedState;
			},
		}
	)
);
