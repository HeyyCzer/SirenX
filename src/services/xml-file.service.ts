import { Modal } from '@/utils/modal';
import { getRandomInt } from '@/utils/random';
import * as Sentry from '@sentry/nextjs';
import { xml2json } from 'xml-js';
import { buildSirenData, exportSirenData } from './siren-transformer.service';

interface SirenData {
	id: { $: { value: string } };
	name?: { _text: string };
	sirens: {
		Item: unknown | unknown[];
	};
	sequencerBpm: { $: { value: string } };
}

interface UploadedFileJson {
	CVehicleModelInfoVarGlobal?: {
		Sirens?: {
			Item?: SirenData | SirenData[];
		};
	};
}

export const importXmlFile = async (fileContent: string) => {
	let xmlJson: string;
	try {
		xmlJson = xml2json(fileContent, { compact: true, attributesKey: "$" });
	} catch {
		return void Modal.fire({
			icon: 'error',
			title: 'Error',
			text: 'The file provided is not a valid .meta file. Please, check the file and try again'
		});
	}

	const json: UploadedFileJson = JSON.parse(xmlJson);
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
	const sirensArray: SirenData[] = hasMultipleSirens ? sirens : [sirens];

	let selectedSiren: SirenData | undefined = sirensArray[0];
	if (sirensArray.length > 1) {
		let sirenOptions: Record<string, string>;
		try {
			sirenOptions = sirensArray.reduce((acc, siren) => ({ ...acc, [siren.id.$.value]: `${siren?.name?._text || "NO-NAME"} (ID: ${siren.id.$.value})` }), {} as Record<string, string>);

		} catch(err) {
			Sentry.captureException(err, { level: "warning" });

			return void Modal.fire({
				icon: 'error',
				title: 'Error while selecting siren',
				text: 'Looks like one of the sirens in the file is malformed or has an invalid ID. Please, check the file and try again.'
			});
		}

		await Modal.fire({
			title: 'Select a siren to edit',
			text: 'The selected file contains multiple sirens. Please select one to continue.',
			input: 'select',
			inputOptions: sirenOptions,

			showCancelButton: true,
			confirmButtonText: "Let's edit this!"
		}).then((result: { isConfirmed: boolean; value: string }) => {
			if (!result.isConfirmed) return;

			selectedSiren = sirensArray.find((siren) => siren.id.$.value === result.value);
		});
	}

	if (!selectedSiren) return;
	try {
		return buildSirenData(selectedSiren as any, json);
	} catch (err) {
		Sentry.captureException(err, { level: "warning" });

		void Modal.fire({
			icon: 'error',
			title: 'Error while importing',
			text: (err as { customMessage?: string }).customMessage || 'Failed to load your file. Are you sure this is a valid carcols.meta file?'
		});
	}
}

export const exportXmlFile = (editor: any, settings: any, fileName: string) => {
	const editorClone = JSON.parse(JSON.stringify(editor));
	if (!editorClone.sirenId) {
		editorClone.sirenId = getRandomInt(100, 99999)
	}

	try {
		const [content, jsonFileContent] = exportSirenData(editorClone, settings);

		const element = document.createElement('a');
		element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
		element.setAttribute('download', fileName);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);

		return [content, jsonFileContent];
	} catch (err) {
		Sentry.captureMessage(`Error while exporting file: ${(err as { customMessage?: string }).customMessage || "No message"}`, { level: 'warning' });

		return void Modal.fire({
			icon: 'error',
			title: 'Error while exporting',
			text: (err as { customMessage?: string }).customMessage || 'Error while trying to export the file. Please, try again or reset the editor.'
		});
	}
}
