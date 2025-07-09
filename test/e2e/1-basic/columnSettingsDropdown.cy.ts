/// <reference types="cypress" />

import DeltaEnum from "../../../src/enum/direction.enum";

context("ColumnSettingsDropdown", () => {
	beforeEach(() => {
		cy.restoreLocalStorage();
		cy.intercept('*', (req) => {
			req.headers['x-vercel-protection-bypass'] = Cypress.env('VERCEL_AUTOMATION_BYPASS_SECRET');
		});

		cy.visit("/editor", {
			onBeforeLoad: function (window) {
				window.localStorage.setItem('SirenX//tutorial', JSON.stringify({ "state": { "editor-basic-tutorial": true }, "version": 0 }));
			}
		});
	});

	afterEach(() => {
		cy.saveLocalStorage();
	});

	after(() => {
		cy.task('deleteFolder', 'test/downloads');
	});

	it("should change Multiples with valid and invalid values", () => {
		// import a file
		cy.get("input[type=file]").selectFile("./test/assets/carcols.meta", { force: true });

		// should show the import prompt dialog since the file includes multiple sirens
		cy.get(".swal2-container").should("be.visible");
		cy.get(".swal2-container .swal2-confirm").click();

		cy.get('[data-testid="column-settings-dropdown"]').first().click();
		cy.contains('Change Multiples').click();
		// Valor válido
		cy.get('.swal2-input').clear().type('3');
		cy.get('.swal2-confirm').click();
		cy.get('.swal2-container').should('not.exist');

		// Valor inválido (zero)
		cy.get('[data-testid="column-settings-dropdown"]').first().click();
		cy.contains('Change Multiples').click();
		cy.get('.swal2-input').clear().type('0');
		cy.get('.swal2-confirm').click();
		cy.get('.swal2-validation-message').should('be.visible');
	});

	it("should change ScaleFactor with valid and invalid values", () => {
		cy.get('[data-testid="column-settings-dropdown"]').first().click();
		cy.contains('Change Scale Factor').trigger('mouseover').click();
		// Seleciona um valor válido do submenu
		cy.contains('100').click();
		cy.get('.swal2-container').should('not.exist');

		// Custom inválido
		cy.get('[data-testid="column-settings-dropdown"]').first().click();
		cy.contains('Change Scale Factor').trigger('mouseover').click();
		cy.contains('Custom...').click();
		cy.get('.swal2-input').clear().type('-10');
		cy.get('.swal2-confirm').click();
		cy.get('.swal2-validation-message').should('be.visible');
	});

	it("should change Direction with pre-defined value", () => {
		cy.get('[data-testid="column-settings-dropdown"]').first().click();
		cy.contains('Change Direction').trigger('mouseover').click();
		// Seleciona um valor válido do submenu (pega o primeiro disponível)
		cy.get('[role="menuitem"]').contains(DeltaEnum.RIGHT.name).first().click();
		cy.get('.swal2-container').should('not.exist');
	});

	it("should change Direction with custom value", () => {
		cy.get('[data-testid="column-settings-dropdown"]').first().click();
		cy.contains('Change Direction').trigger('mouseover').click();
		cy.contains('Custom...').click();
		cy.get('.swal2-input').clear().type('-1');
		cy.get('.swal2-confirm').click();
		cy.get('.swal2-validation-message').should('not.be.visible');
	});

	it("should export and validate the file with the changes", () => {
		cy.get('#toolbar-export').click();
		cy.get('.swal2-container').should('be.visible');
		cy.get('#swal2-input').type('test-export');
		cy.get('.swal2-confirm').click();
		cy.get('.swal2-container').should('be.visible');
		cy.get('.swal2-confirm').click();

		cy.task('getFolderFiles', 'test/downloads').then((files) => {
			const downloadedFiles = files as string[];
			const metaFile = downloadedFiles.find(f => f.includes('.meta'));
			cy.readFile(`test/downloads/${metaFile}`).then((content) => {
				expect(content).to.not.be.empty;

				const onlyFirst70lines = content.split('\n').slice(700, 700 + 70).join('\n');
				expect(onlyFirst70lines).to.contains(`<multiples value="3"/>`);
				expect(onlyFirst70lines).to.contains(`<scaleFactor value="100"/>`);
				expect(onlyFirst70lines).to.contains(`<delta value="-1"/>`);
			});
		});
	});
});
