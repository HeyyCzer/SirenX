import Colors from "@/lib/colors";

function hexToRgb(hex) {
	// Remover o "#" do início, se presente
	hex = hex.replace(/^#/, '');
  
	// Converter para o formato "RRGGBB" em caso de formato reduzido (ex: "FFF")
	if (hex.length === 3) {
	  hex = hex.replace(/(.)/g, '$1$1');
	}
  
	// Extrair os componentes R, G, B
	const r = Number.parseInt(hex.substring(0, 2), 16);
	const g = Number.parseInt(hex.substring(2, 4), 16);
	const b = Number.parseInt(hex.substring(4, 6), 16);
  
	// Retornar os valores como objeto
	return { r, g, b };
}

function getContrast(hexColor) {
	// Remove o "#" do início, se presente
	hexColor = hexColor.replace(/^#/, '');
  
	// Converte o HEX para RGB
	const r = Number.parseInt(hexColor.substring(0, 2), 16);
	const g = Number.parseInt(hexColor.substring(2, 4), 16);
	const b = Number.parseInt(hexColor.substring(4, 6), 16);
  
	// Calcula o brilho relativo (luminosidade) da cor
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
	// Retorna "black" se a luminosidade for menor ou igual a 125, caso contrário retorna "white"
	return brightness <= 125 ? "white" : "black";
}

const createColor = (carcolsColor) => {
	const key = `CUSTOM_${carcolsColor}`;
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
	Colors[key] = {
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

	// Make custom colors the first ones, so they can be easily found, and sort the custom colors by name.
	const customColors = Object.entries(Colors).filter(([color]) => color.includes("CUSTOM"));
	const sortedColors = Object.entries(Colors).filter(([color]) => !color.includes("CUSTOM")).sort(([a], [b]) => a.localeCompare(b));
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

