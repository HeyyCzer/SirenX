import { Modal } from '@/utils/modal';
import { getRandomInt } from '@/utils/random';
import * as Sentry from '@sentry/nextjs';
import { xml2json } from 'xml-js';
import { buildLights, exportLights } from './lights.controller';

const uploadFile = async (fileContent) => {
	let xmlJson;
	try {
		xmlJson = xml2json(fileContent, { compact: true, attributesKey: "$" });
	} catch {
		return void Modal.fire({
			icon: 'error',
			title: 'Error',
			text: 'The file provided is not a valid .meta file. Please, check the file and try again'
		});
	}

	const json = JSON.parse(xmlJson);
	let sirens = json?.CVehicleModelInfoVarGlobal?.Sirens?.Item;
	if (!sirens) {
		return void Modal.fire({
			icon: 'error',
			title: 'Error',
			text: 'The file provided is not a valid carcols.meta file or does not contain any siren data. Please try another file.'
		});
	}

	Sentry.getCurrentScope().addAttachment({
		filename: `imported-file__${new Date().toISOString().replace(/:/g, '-')}.meta`,
		data: fileContent
	});

	const hasMultipleSirens = Array.isArray(sirens);
	if (!hasMultipleSirens) sirens = [sirens];

	let selectedSiren = sirens[0];
	if (sirens.length > 1) {
		// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
		const sirenOptions = sirens.reduce((acc, siren) => ({ ...acc, [siren.id.$.value]: `${siren?.name?._text || "NO-NAME"} (ID: ${siren.id.$.value})` }), {});
		await Modal.fire({
			title: 'Select a siren to edit',
			text: 'The selected file contains multiple sirens. Please select one to continue.',
			input: 'select',
			inputOptions: sirenOptions,

			showCancelButton: true,
			confirmButtonText: "Let's edit this!"
		}).then(({ isConfirmed, value }) => {
			if (!isConfirmed) return;

			selectedSiren = sirens.find((siren) => siren.id.$.value === value);
		});
	}

	if (!selectedSiren) return;
	try {
		return buildLights(selectedSiren, json);
	} catch (err) {
		Sentry.captureException(err, { level: "warning" });

		void Modal.fire({
			icon: 'error',
			title: 'Error while importing',
			text: err.customMessage || 'Failed to load your file. Are you sure this is a valid carcols.meta file?'
		});
	}
}

const downloadFile = (editor, settings, fileName) => {
	const editorClone = JSON.parse(JSON.stringify(editor));
	if (!editorClone.sirenId) {
		editorClone.sirenId = getRandomInt(100, 99999)
	}

	try {
		const [content, jsonFileContent] = exportLights(editorClone, settings);
	
		const element = document.createElement('a');
		element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
		element.setAttribute('download', fileName);
	
		element.style.display = 'none';
		document.body.appendChild(element);
	
		element.click();
	
		document.body.removeChild(element);
	
		return [content, jsonFileContent];
	} catch (err) {
		Sentry.captureException(err);

		return void Modal.fire({
			icon: 'error',
			title: 'Error while exporting',
			text: err.customMessage || 'Error while trying to export the file. Please, try again or reset the editor.'
		});
	}
}

export {
	downloadFile,
	uploadFile
};

