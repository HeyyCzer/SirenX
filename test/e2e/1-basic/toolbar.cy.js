/// <reference types="cypress" />

const { default: Colors } = require("../../../src/lib/colors");

context("Toolbar", () => {
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

	it("should display the toolbar", () => {
		cy.get("#toolbar").should("be.visible");
	});

	it("should display bpm controller", () => {
		const bpm = cy.get("#toolbar-bpm");

		bpm.should("be.visible");
		
		// bpm slider
		const bpmInput = bpm.children("input");
		bpmInput.should("be.visible");
		
		// test bpm slider
		const range = cy.get("#toolbar-bpm").children("input").as('range');
		range.invoke("val", 300);
		range.trigger("input");
		range.invoke("val").should("eq", "300");

		const range2 = cy.get("#toolbar-bpm").children("input").as('range');
		range2.invoke("val", 100);
		range2.trigger("input");
		range2.invoke("val").should("eq", "100");

		cy.wait(5000);
	});

	it("should display the toolbar colors", () => {
		const colors = cy.get("#toolbar-colors");

		colors.should("be.visible");
		colors.children().should("have.length.at.least", Object.keys(Colors).length - ["_fallback", "none"].length);
	});
});