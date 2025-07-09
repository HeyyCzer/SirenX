declare namespace Cypress {
	interface Chainable {
		saveLocalStorage(key: string): Chainable<void>;
		restoreLocalStorage(key: string): Chainable<void>;
	}
}
