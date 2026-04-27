import path from "node:path";
import DeltaEnum from "../../../src/enum/direction.enum";
import { deleteFolder, expect, getFolderFiles, test } from "../../support/fixtures";

test.describe("ColumnSettingsDropdown", () => {
	test.afterAll(() => {
		deleteFolder("test/downloads");
	});

	test("should change Multiples with valid and invalid values", async ({ editorPage: page }) => {
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

	test("should change ScaleFactor with valid and invalid values", async ({ editorPage: page }) => {
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

	test("should change Direction with pre-defined value", async ({ editorPage: page }) => {
		await page.locator('[data-testid="column-settings-dropdown"]').first().click();
		await page.getByText("Change Direction").hover();
		await page.getByText("Change Direction").click();
		await page.locator('[role="menuitem"]').filter({ hasText: DeltaEnum.RIGHT.name }).first().click();
		await expect(page.locator(".swal2-container")).not.toBeVisible();
	});

	test("should change Direction with custom value", async ({ editorPage: page }) => {
		await page.locator('[data-testid="column-settings-dropdown"]').first().click();
		await page.getByText("Change Direction").hover();
		await page.getByText("Change Direction").click();
		await page.getByText("Custom...").click();
		await page.locator(".swal2-input").clear();
		await page.locator(".swal2-input").fill("-1");
		await page.locator(".swal2-confirm").click();
		await expect(page.locator(".swal2-validation-message")).not.toBeVisible();
	});

	test("should export and validate the file with the changes", async ({ editorPage: page }) => {
		await page.locator("#toolbar-export").click();
		await expect(page.locator(".swal2-container")).toBeVisible();
		await page.locator("#swal2-input").fill("test-export");
		await page.locator(".swal2-confirm").click();
		await expect(page.locator(".swal2-container")).toBeVisible();
		await page.locator(".swal2-confirm").click();

		const files = getFolderFiles("test/downloads");
		expect(files).not.toBeNull();
		const metaFile = (files as string[]).find((f) => f.includes(".meta"));
		expect(metaFile).toBeDefined();

		const content = path.resolve(`test/downloads/${metaFile}`);
		const text = require("node:fs").readFileSync(content, "utf8") as string;
		expect(text).not.toBe("");

		const lines = text.split("\n").slice(700, 770).join("\n");
		expect(lines).toContain('<multiples value="3"/>');
		expect(lines).toContain('<scaleFactor value="100"/>');
		expect(lines).toContain('<delta value="-1"/>');
	});
});
