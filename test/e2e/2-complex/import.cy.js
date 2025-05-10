/// <reference types="cypress" />

const { default: Colors } = require("../../../src/lib/colors");

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

		cy.get(".swal2-container").should("be.visible");
		cy.get(".swal2-container .swal2-confirm").click();

		const redLights = [
			[0, 1, 15, 16, 17, 18],
			[14],
			[0, 1, 15, 16, 17, 18],
			[14],
			[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
		];

		cy.get(".light-row").each(($row, index) => {
			cy.wrap($row).children("button").should("have.length", 20);

			cy.wrap($row).children().each(($light, lightIndex) => {
				if (index >= redLights.length - 1) return;

				const classes = $light[0].className;

				const expectedColor = redLights[index].includes(lightIndex) ? "red" : "none";

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
});