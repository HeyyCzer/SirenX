import { defineConfig } from "cypress";
import fs from 'node:fs';

export default defineConfig({
	trashAssetsBeforeRuns: true,

	screenshotsFolder: "test/screenshots",
	videosFolder: "test/videos",
	downloadsFolder: "test/downloads",
	supportFolder: "test/support",

	e2e: {
		supportFile: "test/support/e2e.ts",
		specPattern: "test/e2e/**/*.cy.{js,jsx,ts,tsx}",

		setupNodeEvents(on, config) {
			on('task', {
				readFileMaybe(filename) {
					if (fs.existsSync(filename))
						return fs.readFileSync(filename, 'utf8')
				},
				getFolderFiles(folder) {
					if (!fs.existsSync(folder))
						return null;
					return fs.readdirSync(folder);
				},
				deleteFolder(folderName) {
					if (!fs.existsSync(folderName))
						return null;

					return new Promise((resolve, reject) => {
						fs.rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
							if (err) {
								console.error(err)
								return reject(err)
							}
							resolve(null)
						})
					})
				},
			})
		},
	},
});
