import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_KEY } from "./editor.store";


export const useSettingsStore = create<any>()(
	persist(
		(set) => ({
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
				description: "This is the total rows of the editor. The maximum is 32.",
				attributes: {
					type: "range",
					min: 1,
					max: 32,
				},
				type: "number",
				value: 20,
			},

			// Actions
			// TODO: Add types to the actions
			updateSettings: ({ key, value }: any) =>
				set((state: any) => {
					let processedValue = value;

					if (state[key].attributes?.type === "checkbox") {
						processedValue = !(value === "true");
					}

					if (state[key].type === "number") {
						processedValue = Number(value);
					}

					return {
						[key]: {
							...state[key],
							value: processedValue
						}
					};
				}),
		}),
		{
			name: `${STORE_KEY}settings`,
		}
	)
);
