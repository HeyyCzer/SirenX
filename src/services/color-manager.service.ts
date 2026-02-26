import { useColorStore } from "@/store/color.store";

interface RgbColor {
	r: number;
	g: number;
	b: number;
}

function hexToRgb(hex: string): RgbColor {
	let hexWithoutHash = hex.replace(/^#/, '');

	if (hex.length === 3) {
		hexWithoutHash = hex.replace(/(.)/g, '$1$1');
	}

	const r = Number.parseInt(hexWithoutHash.substring(0, 2), 16);
	const g = Number.parseInt(hexWithoutHash.substring(2, 4), 16);
	const b = Number.parseInt(hexWithoutHash.substring(4, 6), 16);

	return { r, g, b };
}

function getContrastColor(hexColor: string): "white" | "black" {
	const hexWithoutHash = hexColor.replace(/^#/, '');

	const r = Number.parseInt(hexWithoutHash.substring(0, 2), 16);
	const g = Number.parseInt(hexWithoutHash.substring(2, 4), 16);
	const b = Number.parseInt(hexWithoutHash.substring(4, 6), 16);

	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness <= 125 ? "white" : "black";
}

export const createCustomColor = (carcolsColor: string): string => {
	const key = `CUSTOM_${carcolsColor}`;
	const Colors = useColorStore.getState().colors;
	if (Colors[key]) return key;

	const hexColor = carcolsColor.slice(4);
	const rgbColor = hexToRgb(hexColor);
	const textColor = getContrastColor(hexColor);

	// Set CSS variables on :root for this custom color
	const varPrefix = `--color-${key.toLowerCase()}`;
	document.documentElement.style.setProperty(`${varPrefix}-r`, rgbColor.r.toString());
	document.documentElement.style.setProperty(`${varPrefix}-g`, rgbColor.g.toString());
	document.documentElement.style.setProperty(`${varPrefix}-b`, rgbColor.b.toString());
	document.documentElement.style.setProperty(`${varPrefix}-text`, textColor);

	// Create dynamic CSS classes that use the CSS variables
	if (!document.querySelector(`style[data-custom-color="${key}"]`)) {
		const style = document.createElement("style");
		style.setAttribute("data-custom-color", key);
		style.innerHTML = `
			.bg-${key} {
				background-color: rgb(var(${varPrefix}-r) var(${varPrefix}-g) var(${varPrefix}-b) / 50%);
				color: var(${varPrefix}-text);
			}
			.hover\\:bg-${key}:hover, .active-bg-${key}, .current-bg-${key} {
				background-color: rgb(var(${varPrefix}-r) var(${varPrefix}-g) var(${varPrefix}-b));
				color: var(${varPrefix}-text);
			}
			.current-bg-${key} {
				filter: drop-shadow(0 0 10px rgb(var(${varPrefix}-r) var(${varPrefix}-g) var(${varPrefix}-b)));
			}
		`;
		document.head.appendChild(style);
	}

	const totalCustoms = Object.keys(Colors).filter((color) => color.includes("CUSTOM")).length;
	const newColor = {
		toolbar: {
			name: `Custom ${totalCustoms + 1}`,
			default: `bg-${key} hover:bg-${key}`,
			selected: `active-bg-${key}`,
		},
		editor: {
			default: `bg-${key}`,
			current: `current-bg-${key}`,
		},
		carcols: {
			color: carcolsColor,
		},
		css: {
			rgb: rgbColor,
			textColor: textColor,
			varPrefix: varPrefix,
		}
	};
	useColorStore.setState((state) => ({
		colors: {
			...state.colors,
			[key]: newColor,
		},
	}));

	// Make custom colors the first ones, so they can be easily found, and sort the custom colors by name.
	const customColors = Object.entries(Colors).filter(([color]) => color.includes("CUSTOM"));
	const sortedColors = Object.entries(Colors).filter(([color]) => !color.includes("CUSTOM")).sort(([a], [b]) => Object.keys(Colors).indexOf(a) - Object.keys(Colors).indexOf(b));
	const newColors = Object.fromEntries([...customColors, ...sortedColors]);
	for (const index in newColors) {
		delete Colors[index];
	}

	Object.assign(Colors, newColors);

	return key;
}

export const restoreCustomColors = (): void => {
	const Colors = useColorStore.getState().colors;

	for (const [key, colorData] of Object.entries(Colors)) {
		if (key.includes("CUSTOM") && colorData.css) {
			const { rgb, textColor, varPrefix } = colorData.css;

			// Set CSS variables
			document.documentElement.style.setProperty(`${varPrefix}-r`, rgb.r.toString());
			document.documentElement.style.setProperty(`${varPrefix}-g`, rgb.g.toString());
			document.documentElement.style.setProperty(`${varPrefix}-b`, rgb.b.toString());
			document.documentElement.style.setProperty(`${varPrefix}-text`, textColor);

			// Check if style tag already exists
			if (document.querySelector(`style[data-custom-color="${key}"]`)) continue;

			// Create dynamic CSS classes
			const style = document.createElement("style");
			style.setAttribute("data-custom-color", key);
			style.innerHTML = `
				.bg-${key} {
					background-color: rgb(var(${varPrefix}-r) var(${varPrefix}-g) var(${varPrefix}-b) / 50%);
					color: var(${varPrefix}-text);
				}
				.hover\\:bg-${key}:hover, .active-bg-${key}, .current-bg-${key} {
					background-color: rgb(var(${varPrefix}-r) var(${varPrefix}-g) var(${varPrefix}-b));
					color: var(${varPrefix}-text);
				}
				.current-bg-${key} {
					filter: drop-shadow(0 0 10px rgb(var(${varPrefix}-r) var(${varPrefix}-g) var(${varPrefix}-b)));
				}
			`;
			document.head.appendChild(style);
		}
	}
}
