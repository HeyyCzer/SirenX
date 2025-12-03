import DeltaEnum from "@/enum/direction.enum";
import { useColorStore } from "@/store/color.store";
import { defaultCarcolsLightModel, defaultLightModel } from "@/store/constants";
import { binaryToDecimal, decimalToBinary } from "@/utils/binary";
import { json2xml } from "xml-js";
import { createCustomColor } from "./color-manager.service";
import { cloneNestedKeys, createNestedKeys } from "./xml-helpers.service";

interface SirenItem {
	flashiness: {
		sequencer: { $: { value: string } };
		delta: { $: { value: string } };
		multiples: { $: { value: string } };
	};
	intensity: { $: { value: string } };
	scaleFactor: { $: { value: string } };
	color: { $: { value: string } };
}

interface SirenData {
	id: { $: { value: string } };
	name?: { _text: string };
	sirens: {
		Item: SirenItem | SirenItem[];
	};
	sequencerBpm: { $: { value: string } };
}

interface LightCell {
	color: string;
	direction: number;
	multiples: number;
	intensity: number;
	scaleFactor: number;
}

interface EditorState {
	bpm: number;
	id: string;
	name: string;
	file: any;
	lights: LightCell[][];
}

export const buildSirenData = (sirenSelected: SirenData, fullFile: any): EditorState => {
	const sirenItems = Array.isArray(sirenSelected.sirens.Item)
		? sirenSelected.sirens.Item
		: [sirenSelected.sirens.Item];

	const builtSirens: LightCell[][] = [];
	for (const columnIndex in sirenItems) {
		const numberIndex = Number(columnIndex);
		try {
			console.debug(`Processing siren column ${numberIndex + 1}`);

			const columnData = sirenItems[columnIndex];
			const defaultModel = defaultCarcolsLightModel;

			cloneNestedKeys(columnData, defaultModel);

			createNestedKeys(columnData, ["flashiness", "delta", "$", "value"], 0);
			createNestedKeys(columnData, ["flashiness", "multiples", "$", "value"], 0);
			createNestedKeys(columnData, ["intensity", "$", "value"], 0);
			createNestedKeys(columnData, ["scaleFactor", "$", "value"], 0);
			createNestedKeys(columnData, ["color", "$", "value"], 0);

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
				const colorId = createCustomColor(carcolsColor);
				color = colorId;
			}

			const binarySequence = decimalToBinary(
				Number(columnData.flashiness.sequencer.$.value),
			);
			for (let row = 0; row < binarySequence.length; row++) {
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
		bpm: Number(sirenSelected.sequencerBpm.$.value),
		id: sirenSelected.id.$.value,
		name: sirenSelected.name?._text ?? "SirenX-GeneratedCarcols",
		file: fullFile,
		lights: builtSirens,
	};
};

export const exportSirenData = (editor: any, settings: any): [string, any] => {
	const fullFile = JSON.parse(JSON.stringify(editor.uploadedFile));

	const lights = editor.lights;

	let siren = fullFile?.CVehicleModelInfoVarGlobal?.Sirens.Item;
	if (Array.isArray(siren)) {
		siren = siren.find((siren: any) => siren.id.$.value === editor.sirenId);
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

	const sequencer: Record<number, string> = {};
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

			createNestedKeys(
				columnData,
				["flashiness", "delta", "$", "value"],
				-1,
				`@column${columnIndex + 1}`
			);
			createNestedKeys(
				columnData,
				["flashiness", "multiples", "$", "value"],
				-1,
				`@column${columnIndex + 1}`
			);
			createNestedKeys(columnData, ["intensity", "$", "value"], -1, `@column${columnIndex + 1}`);
			createNestedKeys(columnData, ["scaleFactor", "$", "value"], -1, `@column${columnIndex + 1}`);
			createNestedKeys(columnData, ["color", "$", "value"], -1, `@column${columnIndex + 1}`);

			columnData.flashiness.delta.$.value = light.direction ?? DeltaEnum.FRONT.delta;
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
