import { expect, test } from "../../support/fixtures";

test.describe("Tutorial", () => {
	test("should tutorial be visible", async ({ editorPageWithTutorial: page }) => {
		await expect(page.locator("#react-joyride-step-0")).toBeVisible({ timeout: 10000 });
		await expect(page.locator("#react-joyride-step-1")).not.toBeVisible();

		await page.locator("#react-joyride-portal #next").click();

		await expect(page.locator("#react-joyride-step-0")).not.toBeVisible();
		await expect(page.locator("#react-joyride-step-1")).toBeVisible();
	});
});
