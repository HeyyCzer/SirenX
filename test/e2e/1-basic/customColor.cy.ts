/// <reference types="cypress" />

describe("Toolbar - Custom Color", () => {
	beforeEach(() => {
		cy.intercept('*', (req) => {
			req.headers['x-vercel-protection-bypass'] = Cypress.env('VERCEL_AUTOMATION_BYPASS_SECRET');
		});

		cy.visit("/editor", {
			onBeforeLoad: function (window) {
				window.localStorage.setItem('SirenX//tutorial', JSON.stringify({"state":{"editor-basic-tutorial":true},"version":0}));
			}
		});
	});

	it("should create and select a custom color", () => {
		cy.get("#toolbar").should("be.visible");

		cy.get("[data-test-id='toolbar-create-custom-color']").as("colorButton");

		const color = "#FF5733";

		cy.get("@colorButton").click();
		cy.get(".swal2-container").should("be.visible");
		cy.get("#swal-color-picker").should("be.visible");

		cy.get("#swal-color-picker").then($input => {
			$input.val(color)

			$input[0].dispatchEvent(new Event('input', { bubbles: true }))
			$input[0].dispatchEvent(new Event('change', { bubbles: true }))
		});

		cy.get(".swal2-confirm").click();
		cy.get(".swal2-container").should("not.exist");
		cy.get(`[data-test-id='toolbar-color-CUSTOM_0xFF${color.replace("#", "")}']`).should("exist");
	});
});
