/// <reference types="cypress" />

import { useColorStore } from "../../../src/store/color.store";

context("Importing", () => {
	beforeEach(() => {
		cy.intercept('*', (req) => {
			req.headers['x-vercel-protection-bypass'] = Cypress.env('VERCEL_AUTOMATION_BYPASS_SECRET');
		});

		cy.visit("/editor", {
			onBeforeLoad: function (window) {
				window.localStorage.setItem('SirenX//tutorial', JSON.stringify({ "state": { "editor-basic-tutorial": true }, "version": 0 }));
			}
		});
	});

	it("import button should be visible", () => {
		cy.get("#toolbar-import").should("be.visible");
	});

	it("should import file correctly", () => {
		cy.get("input[type=file]").as("fileInput");

		cy.get("@fileInput").should("not.be.visible");
		cy.get("@fileInput").selectFile("./test/assets/carcols.meta", { force: true });

		// should show the import prompt dialog since the file includes multiple sirens
		cy.get(".swal2-container").should("be.visible");
		cy.get(".swal2-container .swal2-confirm").click();

		const Colors = useColorStore.getState().colors;

		const redLights = [
			[0, 2, 4, 5, 6],
			[1, 3, 9],
			[4, 5],
			[0, 1, 2, 3, 6, 9],
			[4, 5],
			[1, 3, 9],
			[0, 2, 4, 5, 6],
			[0, 1, 2, 3, 4, 5, 6, 9]
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
		]

		cy.get(".light-row").each(($row, index) => {
			cy.wrap($row).children("button").should("have.length", 20);

			cy.wrap($row).children().each(($light, lightIndex) => {
				if (index >= redLights.length - 1) return;
				if (index >= whiteLights.length - 1) return;

				const classes = $light[0].className;

				const expectsRed = redLights[index].includes(lightIndex);
				const expectsWhite = whiteLights[index].includes(lightIndex);

				const expectedColor = expectsRed ? "red" : expectsWhite ? "white" : null;
				if (!expectedColor) return;

				const color = Colors[expectedColor].editor.default;
				const colorActive = Colors[expectedColor].editor.current;
				const isValid = classes.includes(color) || classes.includes(colorActive);

				if (!isValid) {
					console.warn(`Light: ${index}-${lightIndex}`);
					console.warn(`Expected color: ${expectedColor}`);
					console.warn(`Classes: ${classes}`);
				}

				expect(isValid, "Checking for color").to.be.true;
			});
		});
	});

	it("should import file with custom colors correctly", () => {
		cy.get("input[type=file]").as("fileInput");

		cy.get("@fileInput").should("not.be.visible");
		cy.get("@fileInput").selectFile("./test/assets/carcols-custom-colors.meta", { force: true });

		cy.get("#toolbar-colors").children().should("have.length", 10 + 1); // 10 imported colors + 1 custom color create button
	});
});