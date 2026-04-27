import { expect, test } from "../../support/fixtures";

test.describe("Toolbar - Custom Color", () => {
	test("should create and select a custom color", async ({ editorPage: page }) => {
		await expect(page.locator("#toolbar")).toBeVisible();

		const colorButton = page.locator("[data-test-id='toolbar-create-custom-color']");
		const color = "#FF5733";

		await colorButton.click();
		await expect(page.locator(".swal2-container")).toBeVisible();

		const colorPicker = page.locator("#swal-color-picker");
		await expect(colorPicker).toBeVisible();

		await colorPicker.evaluate((el: HTMLInputElement, value) => {
			el.value = value;
			el.dispatchEvent(new Event("input", { bubbles: true }));
			el.dispatchEvent(new Event("change", { bubbles: true }));
		}, color);

		await page.locator(".swal2-confirm").click();
		await expect(page.locator(".swal2-container")).not.toBeVisible();

		const colorHex = color.replace("#", "");
		await expect(page.locator(`[data-test-id='toolbar-color-CUSTOM_0xFF${colorHex}']`)).toBeVisible();
	});
});
