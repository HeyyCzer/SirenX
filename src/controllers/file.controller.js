import { Modal } from '@/utils/modal';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { buildLights, exportLights } from './lights.controller';

import { getRandomInt } from '@/utils/random';
import { xml2json } from 'xml-js';

const uploadFile = async (fileContent) => {
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
		const sirenOptions = sirens.reduce((acc, siren) => ({ ...acc, [siren.id.$.value]: `${siren?.name?._text || "NO-NAME"} (ID: ${siren.id.$.value})` }), {});
		await Modal.fire({
			title: 'Select a siren to edit',
			text: 'The selected file contains multiple sirens. Please select one to continue.',
			input: 'select',
			inputOptions: sirenOptions,

			showCancelButton: true,
			confirmButtonText: (
				<>
					<FontAwesomeIcon icon={faCheck} />
					<span className="ml-1">Let&apos;s edit this!</span>
				</>
			)
		}).then(({ isConfirmed, value }) => {
			if (!isConfirmed) return;

			selectedSiren = sirens.find((siren) => siren.id.$.value === value);
		});
	}

	if (!selectedSiren) return;

	return buildLights(selectedSiren, json);
}

const downloadFile = (editor, settings, fileName) => {
	const editorClone = JSON.parse(JSON.stringify(editor));
	if (!editorClone.sirenId) {
		editorClone.sirenId = getRandomInt(100, 99999)
	}

	const [content, jsonFileContent] = exportLights(editorClone, settings);

	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
	element.setAttribute('download', fileName);
  
	element.style.display = 'none';
	document.body.appendChild(element);
  
	element.click();
  
	document.body.removeChild(element);

	return [content, jsonFileContent];
}

export {
	downloadFile,
	uploadFile
};

