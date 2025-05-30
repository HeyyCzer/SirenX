import { Modal } from '@/utils/modal';
import { getRandomInt } from '@/utils/random';
import * as Sentry from '@sentry/nextjs';
import { xml2json } from 'xml-js';
import { buildLights, exportLights } from './lights.controller';

const uploadFile = async (fileContent) => {
	Sentry.getCurrentScope().addAttachment({
		filename: `imported-file__${new Date().toISOString().replace(/:/g, '-')}.meta`,
		data: fileContent
	});

	let xmlJson = null;
	try {
		xmlJson = xml2json(fileContent, { compact: true, attributesKey: "$" });
	} catch (err) {
		return Modal.fire({
			icon: 'error',
			title: 'Error',
			text: 'The file provided is not a valid XML file. Please, check the file and try again'
		});
	}

	const json = JSON.parse(xmlJson);
	let sirens = json?.CVehicleModelInfoVarGlobal?.Sirens?.Item;
	if (!sirens) {
		return Modal.fire({
			icon: 'error',
			title: 'Error',
			text: 'The file provided is not a valid carcols.meta file or does not contain any siren data. Please try another file.'
		});
	}

	const hasMultipleSirens = Array.isArray(sirens);
	if (!hasMultipleSirens) {
		sirens = [sirens];
	}

	let selectedSiren = null;
	if (sirens.length === 1) {
		selectedSiren = sirens[0];
	} else {
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
		Sentry.captureException(err);

		await Modal.fire({
			icon: 'error',
			title: 'Error while importing',
			text: 'An error occurred while trying to build the lights. Please, try again or use another file.'
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

		return Modal.fire({
			icon: 'error',
			title: 'Error while exporting',
			text: 'An error occurred while trying to export the file. Please, try again or reset the editor.'
		});
	}
}

export {
	downloadFile,
	uploadFile
};

