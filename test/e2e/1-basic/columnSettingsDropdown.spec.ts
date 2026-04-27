import path from "node:path";
import type { Page } from "@playwright/test";
import DeltaEnum from "../../../src/enum/direction.enum";
import { deleteFolder, dismissTutorial, expect, test } from "../../support/fixtures";

test.describe.serial("ColumnSettingsDropdown", () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		const context = await browser.newContext();
		page = await context.newPage();
		await dismissTutorial(page);
		await page.goto("/editor");
	});

	test.afterAll(async () => {
		await page.close();
		deleteFolder("test/downloads");
	});

	test("should change Multiples with valid and invalid values", async () => {
		await page.locator("input[type=file]").setInputFiles(path.resolve("test/assets/carcols.meta"));

		await expect(page.locator(".swal2-container")).toBeVisible();
		await page.locator(".swal2-container .swal2-confirm").click();

		await page.locator('[data-testid="column-settings-dropdown"]').first().click();
		await page.getByText("Change Multiples").click();
		await page.locator(".swal2-input").clear();
		await page.locator(".swal2-input").fill("3");
		await page.locator(".swal2-confirm").click();
		await expect(page.locator(".swal2-container")).not.toBeVisible();

		await page.locator('[data-testid="column-settings-dropdown"]').first().click();
		await page.getByText("Change Multiples").click();
		await page.locator(".swal2-input").clear();
		await page.locator(".swal2-input").fill("0");
		await page.locator(".swal2-confirm").click();
		await expect(page.locator(".swal2-validation-message")).toBeVisible();
	});

	test("should change ScaleFactor with valid and invalid values", async () => {
		await page.locator('[data-testid="column-settings-dropdown"]').first().click();
		await page.getByText("Change Scale Factor").hover();
		await page.getByText("Change Scale Factor").click();
		await page.getByText("100").click();
		await expect(page.locator(".swal2-container")).not.toBeVisible();

		await page.locator('[data-testid="column-settings-dropdown"]').first().click();
		await page.getByText("Change Scale Factor").hover();
		await page.getByText("Change Scale Factor").click();
		await page.getByText("Custom...").click();
		await page.locator(".swal2-input").clear();
		await page.locator(".swal2-input").fill("-10");
		await page.locator(".swal2-confirm").click();
		await expect(page.locator(".swal2-validation-message")).toBeVisible();
	});

	test("should change Direction with pre-defined value", async () => {
		await page.locator('[data-testid="column-settings-dropdown"]').first().click();
		await page.getByText("Change Direction").hover();
		await page.getByText("Change Direction").click();
		await page.locator('[role="menuitem"]').filter({ hasText: DeltaEnum.RIGHT.name }).first().click();
		await expect(page.locator(".swal2-container")).not.toBeVisible();
	});

	test("should change Direction with custom value", async () => {
		await page.locator('[data-testid="column-settings-dropdown"]').first().click();
		await page.getByText("Change Direction").hover();
		await page.getByText("Change Direction").click();
		await page.getByText("Custom...").click();
		await page.locator(".swal2-input").clear();
		await page.locator(".swal2-input").fill("-1");
		await page.locator(".swal2-confirm").click();
		await expect(page.locator(".swal2-validation-message")).not.toBeVisible();
	});

	test("should export and validate the file with the changes", async () => {
		await page.locator("#toolbar-export").click();
		await expect(page.locator(".swal2-container")).toBeVisible();
		// first dialog is Siren ID (type=number), .fill() doesn't work on number inputs
		const sirenIdInput = page.locator("#swal2-input");
		await sirenIdInput.clear();
		await sirenIdInput.pressSequentially("100");
		await page.locator(".swal2-confirm").click();
		await expect(page.locator(".swal2-container")).toBeVisible();

		const [download] = await Promise.all([
			page.waitForEvent("download"),
			page.locator(".swal2-confirm").click(),
		]);
		await download.saveAs(`test/downloads/${download.suggestedFilename()}`);

		const text = require("node:fs").readFileSync(`test/downloads/${download.suggestedFilename()}`, "utf8") as string;
		expect(text).not.toBe("");

		expect(text).toContain('<multiples value="3"/>');
		expect(text).toContain('<scaleFactor value="100"/>');
		expect(text).toContain('<delta value="-1"/>');
	});
});
