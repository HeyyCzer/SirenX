import { useColorStore } from "../../../src/store/color.store";
import { expect, test } from "../../support/fixtures";

test.describe("Toolbar", () => {
	test("should display the toolbar", async ({ editorPage: page }) => {
		await expect(page.locator("#toolbar")).toBeVisible();
	});

	test("should display bpm controller", async ({ editorPage: page }) => {
		const bpm = page.locator("#toolbar-bpm");
		await expect(bpm).toBeVisible();

		const range = bpm.locator("input");
		await expect(range).toBeVisible();

		await range.evaluate((el: HTMLInputElement) => { el.value = "300"; el.dispatchEvent(new Event("input", { bubbles: true })); });
		await expect(range).toHaveValue("300");

		await range.evaluate((el: HTMLInputElement) => { el.value = "100"; el.dispatchEvent(new Event("input", { bubbles: true })); });
		await expect(range).toHaveValue("100");

		await page.waitForTimeout(5000);
	});

	test("should display the toolbar colors", async ({ editorPage: page }) => {
		const colors = page.locator("#toolbar-colors");
		await expect(colors).toBeVisible();

		const Colors = useColorStore.getState().colors;
		const minExpected = Object.keys(Colors).filter((k) => !["_fallback", "none"].includes(k)).length;

		await expect(colors.locator(":scope > *")).toHaveCount(minExpected, { timeout: 5000 });
	});
});
