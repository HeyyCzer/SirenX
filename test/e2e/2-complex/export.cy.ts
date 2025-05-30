/// <reference types="cypress" />

context("Export", () => {
	beforeEach(() => {
		cy.intercept('*', (req) => {
			req.headers['x-vercel-protection-bypass'] = Cypress.env('VERCEL_AUTOMATION_BYPASS_SECRET');
		});

		cy.visit("/editor", {
			onBeforeLoad: function (window) {
				window.localStorage.setItem('SirenX//tutorial', JSON.stringify({"state":{"editor-basic-tutorial":true},"version":0}));
			}
		});

		cy.task("deleteFolder", "test/downloads");
	});

	after(() => {
		cy.task("deleteFolder", "test/downloads");
	});

	it("export button should be visible", () => {
		cy.get("#toolbar-export").should("be.visible");
	});
	
	it("should export file", () => {
		cy.get("#toolbar-export").as("export");

		cy.get("@export").should("be.visible");

		const redLights = [
			[0, 1, 15, 16, 17, 18],
			[14],
			[0, 1, 15, 16, 17, 18],
			[14],
			[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
		];

		for (let i = 0; i < redLights.length; i++) {
			for (let j = 0; j < 20; j++) {
				if (!redLights[i]?.includes(j)) continue;

				cy.get(`#light-${i}-${j}`).click({ force: true });
			}
		}

		// export to file
		cy.get("@export").click();
		cy.get(".swal2-container").should("be.visible");
		cy.get("#swal2-input").type("3232");
		cy.get(".swal2-confirm").click();

		cy.get(".swal2-container").should("be.visible");
		cy.get("#swal2-input").invoke("val", "");
		cy.get("#swal2-input").type("example");
		cy.get(".swal2-confirm").click();

		cy.get("#sponsor-modal").should("be.visible");

		cy.get("#sponsor-modal button").first().click();

		// repeat export to check if saves the last inserted info
		cy.wait(5e3);

		cy.get("@export").click();
		cy.get(".swal2-container").should("be.visible");
		cy.get(".swal2-confirm").click();

		cy.get(".swal2-container").should("be.visible");
		cy.get(".swal2-confirm").click();

		cy.get("#sponsor-modal").should("not.exist");

		cy.task("getFolderFiles", "test/downloads").then((files) => {
			let found = 0;
	
			expect(files).to.be.an("array");
	
			for (const file of files) {
				if (file.includes(".meta")) {
					found++;
				}
			}
	
			expect(found).to.be.equal(2);
		});
	});
});