import DeltaEnum from "@/enum/direction.enum";
import Colors from "@/lib/colors";
import {
	defaultCarcolsLightModel,
	defaultLightModel,
} from "@/store/reducers/editor.reducer";
import { binaryToDecimal, decimalToBinary } from "@/utils/binary";
import { json2xml } from "xml-js";
import { createColor } from "./colors.controller";

const buildLights = (sirenSelected, fullFile) => {
	const sirenItems = Array.isArray(sirenSelected.sirens.Item)
		? sirenSelected.sirens.Item
		: [sirenSelected.sirens.Item];

	const builtSirens = [];
	for (const columnIndex in sirenItems) {
		const columnData = sirenItems[columnIndex];

		const direction = Number(columnData.flashiness.delta.$.value);
		const multiples = Number(columnData.flashiness.multiples.$.value);
		const intensity = Number(columnData.intensity.$.value);
		const scaleFactor = Number(columnData.scaleFactor.$.value);

		const carcolsColor = columnData.color.$.value;
		let color = null;
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

	const sequencer = {};
	for (let rowIndex = 0; rowIndex < 32; rowIndex++) {
		let row = lights[rowIndex];
		if (!row) {
			row = [];
		}

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

			columnData.flashiness.delta.$.value =
				light?.direction ?? DeltaEnum.FRONT.delta;
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

export { buildLights, exportLights };
