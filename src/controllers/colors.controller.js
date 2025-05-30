import { useColorStore } from "@/store/color.store";

function hexToRgb(hex) {
	let hexWithoutHash = hex.replace(/^#/, '');
  
	if (hex.length === 3) {
		hexWithoutHash = hex.replace(/(.)/g, '$1$1');
	}
  
	const r = Number.parseInt(hexWithoutHash.substring(0, 2), 16);
	const g = Number.parseInt(hexWithoutHash.substring(2, 4), 16);
	const b = Number.parseInt(hexWithoutHash.substring(4, 6), 16);
  
	return { r, g, b };
}

function getContrast(hexColor) {
	const hexWithoutHash = hexColor.replace(/^#/, '');
  
	const r = Number.parseInt(hexWithoutHash.substring(0, 2), 16);
	const g = Number.parseInt(hexWithoutHash.substring(2, 4), 16);
	const b = Number.parseInt(hexWithoutHash.substring(4, 6), 16);
  
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness <= 125 ? "white" : "black";
}

const createColor = (carcolsColor) => {
	const key = `CUSTOM_${carcolsColor}`;
	const Colors = useColorStore.getState().colors;
	if (Colors[key]) return key;

	const hexColor = carcolsColor.slice(4);
	const rgbColor = hexToRgb(hexColor);

	const style = document.createElement("style")
	style.innerHTML = `
		.bg-${key} {
			background-color: rgb(${rgbColor.r} ${rgbColor.g} ${rgbColor.b} / 50%);
			${getContrast(hexColor) === "black" ? "color: black;" : "color: white;"}
		}
		.hover\\:bg-${key}:hover, .active-bg-${key}, .current-bg-${key} {
			background-color: rgb(${rgbColor.r} ${rgbColor.g} ${rgbColor.b});
			${getContrast(hexColor) === "black" ? "color: black;" : "color: white;"}
		}
		.current-bg-${key} {
			filter: drop-shadow(0 0 10px rgb(${rgbColor.r} ${rgbColor.g} ${rgbColor.b}));
		}
	`;
	document.head.appendChild(style);

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

export {
	createColor
};

