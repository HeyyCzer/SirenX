declare namespace Cypress {
	interface Chainable {
		saveLocalStorage(): Chainable<void>;
		restoreLocalStorage(): Chainable<void>;
	}
}
