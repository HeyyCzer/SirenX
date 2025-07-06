import DeltaEnum from "@/enum/direction.enum";
import { useColorStore } from "@/store/color.store";
import { defaultCarcolsLightModel, defaultLightModel } from "@/store/constants";
import { binaryToDecimal, decimalToBinary } from "@/utils/binary";
import { addBreadcrumb } from "@sentry/nextjs";
import { json2xml } from "xml-js";
import { createColor } from "./colors.controller";

const buildLights = (sirenSelected, fullFile) => {
	const sirenItems = Array.isArray(sirenSelected.sirens.Item)
		? sirenSelected.sirens.Item
		: [sirenSelected.sirens.Item];

	const builtSirens = [];
	for (const columnIndex in sirenItems) {
		const numberIndex = Number(columnIndex);
		try {
			console.debug(`Processing siren column ${numberIndex + 1}`);

			const columnData = sirenItems[columnIndex];
			const defaultModel = defaultCarcolsLightModel;

			recursivelyCloneKeysIfNotExists(columnData, defaultModel);

			recursivelyCreateKeysIfNotExists(columnData, ["flashiness", "delta", "$", "value"], 0);
			recursivelyCreateKeysIfNotExists(columnData, ["flashiness", "multiples", "$", "value"], 0);
			recursivelyCreateKeysIfNotExists(columnData, ["intensity", "$", "value"], 0);
			recursivelyCreateKeysIfNotExists(columnData, ["scaleFactor", "$", "value"], 0);
			recursivelyCreateKeysIfNotExists(columnData, ["color", "$", "value"], 0);

			const direction = Number(columnData.flashiness.delta.$.value);
			const multiples = Number(columnData.flashiness.multiples.$.value);
			const intensity = Number(columnData.intensity.$.value);
			const scaleFactor = Number(columnData.scaleFactor.$.value);

			const carcolsColor = columnData.color.$.value;
			let color = null;

			const Colors = useColorStore.getState().colors;
			for (const [colorName, colorData] of Object.entries(Colors)) {
				if (colorData.carcols.color === carcolsColor) {
					color = colorName;
					break;
				}
			}

			if (!color) {
				const colorId = createColor(carcolsColor);
				color = colorId;
			}

			const binarySequence = decimalToBinary(
				columnData.flashiness.sequencer.$.value,
			);
			for (const row in binarySequence) {
				const active = binarySequence[row] === "1";
				if (!builtSirens[row]) {
					builtSirens[row] = [];
				}

				builtSirens[row][columnIndex] = {
					color: active ? color : "none",
					direction,
					multiples,
					intensity,
					scaleFactor,
				};
			}
		} catch (err) {
			console.warn("Error processing siren column:", numberIndex + 1, err);
			throw {
				customMessage: `Error processing siren column ${numberIndex + 1}. Please check the file structure.`,
			};
		}
	}

	return {
		bpm: sirenSelected.sequencerBpm.$.value,
		id: sirenSelected.id.$.value,
		name: sirenSelected.name?._text ?? "SirenX-GeneratedCarcols",
		file: fullFile,
		lights: builtSirens,
	};
};

const exportLights = (editor, settings) => {
	const fullFile = JSON.parse(JSON.stringify(editor.uploadedFile));

	const lights = editor.lights;

	let siren = fullFile?.CVehicleModelInfoVarGlobal?.Sirens.Item;
	if (Array.isArray(siren)) {
		siren = siren.find((siren) => siren.id.$.value === editor.sirenId);
	}

	siren.id.$.value = editor.newSirenId;
	if (!siren.name) {
		siren.name = {};
	}
	siren.name._text = editor.newSirenName;
	if (!siren.sequencerBpm?.$) {
		if (!siren.sequencerBpm) {
			siren.sequencerBpm = {};
		}
		siren.sequencerBpm.$ = {};
	}
	siren.sequencerBpm.$.value = editor.bpm;

	const Colors = useColorStore.getState().colors;

	const sequencer = {};
	for (let rowIndex = 0; rowIndex < 32; rowIndex++) {
		let row = lights[rowIndex];
		if (!row) row = [];

		for (
			let columnIndex = 0;
			columnIndex < settings.totalColumns.value;
			columnIndex++
		) {
			let light = row[columnIndex];
			if (!siren.sirens.Item[columnIndex]) {
				siren.sirens.Item[columnIndex] = defaultCarcolsLightModel;
			}

			const columnData = siren.sirens.Item[columnIndex];
			siren.sirens.Item[columnIndex] = {
				_comment: ` Siren ${columnIndex + 1} `,
				...columnData,
			};

			if (!light) {
				row[columnIndex] = defaultLightModel;
				light = row[columnIndex];
			}

			if (!sequencer[columnIndex]) sequencer[columnIndex] = "";

			sequencer[columnIndex] += light?.color !== "none" ? "1" : "0";
			if (light?.color === "none" && sequencer[columnIndex].includes("1"))
				continue;

			recursivelyCreateKeysIfNotExists(
				columnData,
				["flashiness", "delta", "$", "value"],
				-1,
				`@column${columnIndex + 1}`
			);
			recursivelyCreateKeysIfNotExists(
				columnData,
				["flashiness", "multiples", "$", "value"],
				-1,
				`@column${columnIndex + 1}`
			);
			recursivelyCreateKeysIfNotExists(columnData, ["intensity", "$", "value"], -1, `@column${columnIndex + 1}`);
			recursivelyCreateKeysIfNotExists(columnData, ["scaleFactor", "$", "value"], -1, `@column${columnIndex + 1}`);
			recursivelyCreateKeysIfNotExists(columnData, ["color", "$", "value"], -1, `@column${columnIndex + 1}`);

			columnData.flashiness.delta.$.value = light?.direction ?? DeltaEnum.FRONT.delta;
			columnData.flashiness.multiples.$.value = light.multiples;
			columnData.intensity.$.value = light.intensity;
			columnData.scaleFactor.$.value = light.scaleFactor;

			const color = Colors[light.color];
			columnData.color.$.value = color.carcols.color;
		}
	}

	for (const [index, sequence] of Object.entries(sequencer)) {
		siren.sirens.Item[index].flashiness.sequencer.$.value =
			binaryToDecimal(sequence);
	}

	return [
		json2xml(fullFile, { compact: true, attributesKey: "$", spaces: 2 }),
		fullFile,
	];
};

function recursivelyCreateKeysIfNotExists(obj, keys, value, path = "@") {
	if (keys.length === 0) return;
	if (keys.length === 1) {
		if (obj[keys[0]] !== undefined) return;

		const debugData = {
			key: keys[0],
			path,
			value,
			object: obj,
		};

		console.debug(`Creating key '${keys[0]}' in object`, debugData);
		addBreadcrumb({
			message: `Creating key '${keys[0]}'`,
			data: debugData,
		});

		obj[keys[0]] = value;
		return;
	}

	const currentKey = keys[0];
	if (!obj[currentKey] || typeof obj[currentKey] !== "object") {
		obj[currentKey] = {};
	}

	recursivelyCreateKeysIfNotExists(obj[currentKey], keys.slice(1), value, `${path}.${currentKey}`);
}


function recursivelyCloneKeysIfNotExists(source, target, path = "@") {
	if (!target || typeof target !== 'object' || Array.isArray(target)) {
		return;
	}

	if (!source || typeof source !== 'object' || Array.isArray(source)) {
		return;
	}

	for (const key in target) {
		// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
		if (target.hasOwnProperty(key)) {
			const currentPath = path === "@" ? key : `${path}.${key}`;

			// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
			if (!source.hasOwnProperty(key)) {
				source[key] = JSON.parse(JSON.stringify(target[key]));

				const debugData = {
					key,
					value: target[key],
					path: currentPath,
					sourceObject: source,
					targetObject: target,
				};

				console.debug(`Cloning key '${key}' from target to source at path '${currentPath}'`, debugData);
				addBreadcrumb({
					message: `Cloning key '${key}' from target to source`,
					data: debugData,
				});
			} else {
				if (typeof source[key] === 'object' && !Array.isArray(source[key]) &&
					typeof target[key] === 'object' && !Array.isArray(target[key])) {
					recursivelyCloneKeysIfNotExists(source[key], target[key], currentPath);
				}
			}
		}
	}
}

export { buildLights, exportLights };

