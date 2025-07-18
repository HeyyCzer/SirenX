// @ts-nocheck

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {

	const headers = {
		'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET
	};

	const mergedOptions = {
		...options,
		headers: {
			...((options && options.headers) || {}),
			...headers
		}
	};

	//
	// make sure to add a return here!
	return originalFn(url, mergedOptions)
});

let LOCAL_STORAGE_MEMORY: Record<string, string> = {};

Cypress.Commands.add('saveLocalStorage', (testKey: string) => {
	Object.keys(localStorage).forEach(key => {
		if (!LOCAL_STORAGE_MEMORY[testKey]) {
			LOCAL_STORAGE_MEMORY[testKey] = {};
		}
		LOCAL_STORAGE_MEMORY[testKey][key] = localStorage.getItem(key) as string;
	});
});

Cypress.Commands.add('restoreLocalStorage', (testKey: string) => {
	if (!LOCAL_STORAGE_MEMORY[testKey]) {
		LOCAL_STORAGE_MEMORY[testKey] = {};
	}

	Object.keys(LOCAL_STORAGE_MEMORY[testKey]).forEach(key => {
		localStorage.setItem(key, LOCAL_STORAGE_MEMORY[testKey][key]);
	});
});
