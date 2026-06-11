export type SettingType = "boolean" | "number";

export interface SettingAttributes {
	type: "checkbox" | "range";
	min?: number;
	max?: number;
}

export interface SettingDeclaration<T = boolean | number> {
	label: string;
	description?: string;
	negativeEffect?: string;
	attributes: SettingAttributes;
	type: SettingType;
	defaultValue: T;
	unlisted?: boolean;
}

export const settingsConfig: Record<string, SettingDeclaration> = {
	separatorsVisible: {
		label: "Show/hide separators",
		description: "This will show the created separators.",
		attributes: { type: "checkbox" },
		type: "boolean",
		defaultValue: true,
	},
	oneColorPerColumn: {
		label: "Limit one color per column",
		description: "This is useful for visualizing your pattern.",
		negativeEffect: "If disabled, you won't be able to export files.",
		attributes: { type: "checkbox" },
		type: "boolean",
		defaultValue: true,
	},
	totalColumns: {
		label: "Total of columns",
		description: "This is the total columns of the editor. Default is 20.",
		negativeEffect: "If greater than 32, you won't be able to export files.",
		attributes: { type: "range", min: 1, max: 50 },
		type: "number",
		defaultValue: 20,
	},
	totalRows: {
		label: "Total of rows",
		description: "This is the total rows of the editor. Default is 32.",
		negativeEffect: "If different than 32, you won't be able to export files.",
		attributes: { type: "range", min: 1, max: 100 },
		type: "number",
		defaultValue: 32,
	},
} as const;

export type SettingKey = keyof typeof settingsConfig;

export type SettingsValues = {
	[K in SettingKey]: (typeof settingsConfig)[K]["defaultValue"];
};

export const defaultSettingsValues: SettingsValues = Object.fromEntries(
	Object.entries(settingsConfig).map(([key, decl]) => [key, decl.defaultValue]),
) as SettingsValues;
