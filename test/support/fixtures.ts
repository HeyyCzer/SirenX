import fs from "node:fs";
import path from "node:path";
import { test as base, type Page } from "@playwright/test";

const TUTORIAL_DISMISSED = JSON.stringify({ state: { "editor-basic-tutorial": true }, version: 0 });

async function dismissTutorial(page: Page) {
	await page.addInitScript((state) => {
		localStorage.setItem("SirenX//tutorial", state);
	}, TUTORIAL_DISMISSED);
}

export const test = base.extend<{
	editorPage: Page;
	editorPageWithTutorial: Page;
}>({
	editorPage: async ({ page }, use) => {
		await dismissTutorial(page);
		await page.goto("/editor");
		await use(page);
	},

	editorPageWithTutorial: async ({ page }, use) => {
		await page.goto("/editor");
		await use(page);
	},
});

export { expect } from "@playwright/test";

export function readFileMaybe(filename: string): string | null {
	const resolved = path.resolve(filename);
	if (fs.existsSync(resolved)) return fs.readFileSync(resolved, "utf8");
	return null;
}

export function getFolderFiles(folder: string): string[] | null {
	const resolved = path.resolve(folder);
	if (!fs.existsSync(resolved)) return null;
	return fs.readdirSync(resolved);
}

export function deleteFolder(folder: string): void {
	const resolved = path.resolve(folder);
	if (fs.existsSync(resolved)) fs.rmSync(resolved, { recursive: true, force: true });
}
