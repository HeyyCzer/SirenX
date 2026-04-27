import path from "node:path";
import { useColorStore } from "../../../src/store/color.store";
import { expect, test } from "../../support/fixtures";

test.describe("Importing", () => {
	test("import button should be visible", async ({ editorPage: page }) => {
		await expect(page.locator("#toolbar-import")).toBeVisible();
	});

	test("should import file correctly", async ({ editorPage: page }) => {
		const fileInput = page.locator("input[type=file]");
		await expect(fileInput).not.toBeVisible();

		await fileInput.setInputFiles(path.resolve("test/assets/carcols.meta"));

		await expect(page.locator(".swal2-container")).toBeVisible();
		await page.locator(".swal2-container .swal2-confirm").click();

		const Colors = useColorStore.getState().colors;

		const redLights = [
			[0, 2, 4, 5, 6],
			[1, 3, 9],
			[4, 5],
			[0, 1, 2, 3, 6, 9],
			[4, 5],
			[1, 3, 9],
			[0, 2, 4, 5, 6],
			[0, 1, 2, 3, 4, 5, 6, 9],
		];

		const whiteLights = [
			[7],
			[8],
			[7],
			[8],
			[7],
			[8],
			[],
			[7, 8],
			[],
			[8],
			[7],
			[8],
			[7],
		];

		const rows = page.locator(".light-row");
		const rowCount = await rows.count();

		for (let index = 0; index < rowCount; index++) {
			const row = rows.nth(index);
			const lights = row.locator(":scope > button");
			await expect(lights).toHaveCount(20);

			if (index >= redLights.length - 1 || index >= whiteLights.length - 1) continue;

			const lightCount = await lights.count();
			for (let lightIndex = 0; lightIndex < lightCount; lightIndex++) {
				const light = lights.nth(lightIndex);
				const classes = await light.getAttribute("class") ?? "";

				const expectsRed = redLights[index].includes(lightIndex);
				const expectsWhite = whiteLights[index].includes(lightIndex);

				const expectedColor = expectsRed ? "red" : expectsWhite ? "white" : null;
				if (!expectedColor) continue;

				const color = Colors[expectedColor].editor.default;
				const colorActive = Colors[expectedColor].editor.current;
				const isValid = classes.includes(color) || classes.includes(colorActive);

				if (!isValid) {
					console.warn(`Light: ${index}-${lightIndex}, expected: ${expectedColor}, classes: ${classes}`);
				}

				expect(isValid, "Checking for color").toBe(true);
			}
		}
	});

	test("should import file with custom colors correctly", async ({ editorPage: page }) => {
		const fileInput = page.locator("input[type=file]");
		await expect(fileInput).not.toBeVisible();

		await fileInput.setInputFiles(path.resolve("test/assets/carcols-custom-colors.meta"));

		await expect(page.locator("#toolbar-colors").locator(":scope > *")).toHaveCount(10 + 1);
	});
});
