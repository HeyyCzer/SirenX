/// <reference types="cypress" />

context("Tutorial", () => {
	beforeEach(() => {
		cy.intercept('*', (req) => {
			req.headers['x-vercel-protection-bypass'] = Cypress.env('VERCEL_AUTOMATION_BYPASS_SECRET');
		});

		cy.visit("/editor");
	});

	it("should tutorial be visible", () => {
		cy.get("#react-joyride-step-0", { timeout: 10000 }).should("be.visible");
		cy.get("#react-joyride-step-1").should("not.exist");

		cy.get("#react-joyride-portal #next").click();
		cy.get("#react-joyride-step-0").should("not.exist");
		cy.get("#react-joyride-step-1").should("be.visible");
	});
});