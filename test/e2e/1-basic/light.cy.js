/// <reference types="cypress" />

const { default: Colors } = require("../../../src/lib/colors");

context("Light", () => {
	beforeEach(() => {
		cy.visit("http://localhost:3000/editor", {
			onBeforeLoad: function (window) {
				window.localStorage.setItem('SirenX//tutorial', JSON.stringify({"editor-basic-tutorial":true}));
			}
		});
	});

	it("should display the correct light amount", () => {
		cy.get(".light-row").should("have.length", 32); // 32 rows

		cy.get(".light-row").each(($row) => {
			cy.wrap($row).children().should("have.length", 20); // 20 columns per row
		});
	});

	it("should be able to change the light color", () => {
		// Get the first light
		cy.get(".light-row").first().children().first().as("firstLight");

		// Set the color to the second color
		cy.log("Testing if it's possible to change the color of the light (1st color)");

		cy.get("#toolbar-colors").children().eq(1).as("colorPicker");
		cy.get("@colorPicker").click();
		cy.get("@firstLight").click();

		cy.get("@firstLight").then(($light) => {
			const classes = $light[0].className;
			expect(classes).to.contains(Colors.blue.editor.default);
		});

		// Set the color to the third color
		cy.log("Testing if it's possible to change the color of the light (2nd color)");

		cy.get("#toolbar-colors").children().eq(2).as("colorPicker");
		cy.get("@colorPicker").click();
		cy.get("@firstLight").click();

		cy.get("@firstLight").then(($light) => {
			const classes = $light[0].className;
			expect(classes).to.contains(Colors.white.editor.default);
		});

		cy.log("Testing if it's possible to remove the color");

		cy.get("@firstLight").rightclick();
		cy.get("@firstLight").then(($light) => {
			const classes = $light[0].className;
			expect(classes).to.contains(Colors.none.editor.default);
		});
	});
});