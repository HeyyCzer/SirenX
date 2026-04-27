import { useColorStore } from "../../../src/store/color.store";
import { expect, test } from "../../support/fixtures";

test.describe("Light", () => {
	test("should display the correct light amount", async ({ editorPage: page }) => {
		const rows = page.locator(".light-row");
		await expect(rows).toHaveCount(32);

		for (const row of await rows.all()) {
			await expect(row.locator(":scope > *")).toHaveCount(20);
		}
	});

	test("should be able to change the light color", async ({ editorPage: page }) => {
		const firstLight = page.locator(".light-row").first().locator(":scope > *").first();
		const Colors = useColorStore.getState().colors;

		await page.locator("#toolbar-colors").locator(":scope > *").nth(1).click();
		await firstLight.click();
		await expect(firstLight).toHaveClass(new RegExp(Colors.blue.editor.default));

		await page.locator("#toolbar-colors").locator(":scope > *").nth(2).click();
		await firstLight.click();
		await expect(firstLight).toHaveClass(new RegExp(Colors.white.editor.default));

		await firstLight.click({ button: "right" });
		await expect(firstLight).toHaveClass(new RegExp(Colors.none.editor.default));
	});
});
