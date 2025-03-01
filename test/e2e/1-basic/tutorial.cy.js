/// <reference types="cypress" />

context("Tutorial", () => {
	beforeEach(() => {
		cy.visit("http://localhost:3000/editor");
	});

	it("should tutorial be visible", () => {
		cy.get("#react-joyride-step-0", { timeout: 10000 }).should("be.visible");
		cy.get("#react-joyride-step-1").should("not.exist");

		cy.get("#react-joyride-portal #next").click();
		cy.get("#react-joyride-step-0").should("not.exist");
		cy.get("#react-joyride-step-1").should("be.visible");
	});
});