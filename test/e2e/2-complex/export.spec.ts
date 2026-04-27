import fs from "node:fs";
import { deleteFolder, expect, test } from "../../support/fixtures";

test.describe("Export", () => {
	test.afterAll(() => {
		deleteFolder("test/downloads");
	});

	test("export button should be visible", async ({ editorPage: page }) => {
		await expect(page.locator("#toolbar-export")).toBeVisible();
	});

	test("should export file and validate content", async ({ editorPage: page }) => {
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
				await page.locator(`#light-${i}-${j}:not([disabled])`).click({ force: true });
			}
		}

		const exportBtn = page.locator("#toolbar-export");

		await exportBtn.click();
		await expect(page.locator(".swal2-container")).toBeVisible();
		// Siren ID input is type=number, must use pressSequentially
		const sirenIdInput = page.locator("#swal2-input");
		await sirenIdInput.clear();
		await sirenIdInput.pressSequentially("3232");
		await page.locator(".swal2-confirm").click();

		await expect(page.locator(".swal2-container")).toBeVisible();
		await page.locator("#swal2-input").fill("example");

		const [download1] = await Promise.all([
			page.waitForEvent("download"),
			page.locator(".swal2-confirm").click(),
		]);
		await download1.saveAs(`test/downloads/${download1.suggestedFilename()}`);

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

		const files = fs.readdirSync("test/downloads");
		const metaFiles = files.filter((f) => f.includes(".meta"));
		expect(metaFiles.length).toBe(2);

		for (const file of metaFiles) {
			const content = fs.readFileSync(`test/downloads/${file}`, "utf8");
			expect(content).not.toContain("[object Object]");
			expect(content).not.toContain("$");
			expect(content).not.toBe("");
			expect(content.length).toBeGreaterThanOrEqual(100);
		}
	});
});
