import { deleteFolder, expect, getFolderFiles, test } from "../../support/fixtures";

test.describe("Export", () => {
	test.afterAll(() => {
		deleteFolder("test/downloads");
	});

	test("export button should be visible", async ({ editorPage: page }) => {
		await expect(page.locator("#toolbar-export")).toBeVisible();
	});

	test("should export file", async ({ editorPage: page, context }) => {
		deleteFolder("test/downloads");

		const redLights = [
			[0, 1, 15, 16, 17, 18],
			[14],
			[0, 1, 15, 16, 17, 18],
			[14],
			[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
		];

		for (let i = 0; i < redLights.length; i++) {
			for (let j = 0; j < 20; j++) {
				if (!redLights[i]?.includes(j)) continue;
				await page.locator(`#light-${i}-${j}`).click({ force: true });
			}
		}

		const exportBtn = page.locator("#toolbar-export");

		await exportBtn.click();
		await expect(page.locator(".swal2-container")).toBeVisible();
		await page.locator("#swal2-input").fill("3232");
		await page.locator(".swal2-confirm").click();

		await expect(page.locator(".swal2-container")).toBeVisible();
		await page.locator("#swal2-input").fill("");
		await page.locator("#swal2-input").fill("example");

		const [download] = await Promise.all([
			page.waitForEvent("download"),
			page.locator(".swal2-confirm").click(),
		]);
		await download.saveAs(`test/downloads/${download.suggestedFilename()}`);

		await expect(page.locator("#sponsor-modal")).toBeVisible();
		await page.locator("#sponsor-modal button").first().click();

		await page.waitForTimeout(5000);

		await exportBtn.click();
		await expect(page.locator(".swal2-container")).toBeVisible();

		const [download2] = await Promise.all([
			page.waitForEvent("download"),
			(async () => {
				await page.locator(".swal2-confirm").click();
				await expect(page.locator(".swal2-container")).toBeVisible();
				await page.locator(".swal2-confirm").click();
			})(),
		]);
		await download2.saveAs(`test/downloads/${download2.suggestedFilename()}`);

		await expect(page.locator("#sponsor-modal")).not.toBeVisible();

		const files = getFolderFiles("test/downloads");
		expect(files).not.toBeNull();
		const metaFiles = (files as string[]).filter((f) => f.includes(".meta"));
		expect(metaFiles.length).toBe(2);
	});

	test("exported file should be valid", async ({ editorPage: page }) => {
		const files = getFolderFiles("test/downloads");
		expect(files).not.toBeNull();

		const metaFiles = (files as string[]).filter((f) => f.includes(".meta"));
		expect(metaFiles.length).toBeGreaterThan(0);

		const fs = require("node:fs") as typeof import("node:fs");
		for (const file of metaFiles) {
			const content = fs.readFileSync(`test/downloads/${file}`, "utf8");
			expect(content).not.toContain("[object Object]");
			expect(content).not.toContain("$");
			expect(content).not.toBe("");
			expect(content.length).toBeGreaterThanOrEqual(100);
		}
	});
});
