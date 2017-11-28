const assert = require('chai').assert;
const config = require('./config.test.json');

export const helpers = {

    pageShouldNotHaveErrors() {
        cy.get('#main-event-notifier .error-count').contains(0);
    },

    pageShouldHaveErrors(errorNumber = 1) {
        cy.get('#main-event-notifier .error-count').contains(errorNumber);
    },

    configureCypress() {
        Cypress.config('baseUrl', config.frontBaseUrl);
    },

    wait(timeMs = 500) {
        cy.wait(timeMs || 500);
    },

    createObjectWithXhrRequest(uniqueId) {

        const creationPayload = {
            "id": uniqueId,
            "content": {},
        };

        return cy.request('POST', `${config.apiUrl}/create/object`, creationPayload);
    },

    deleteObjectWithXhrRequest(objectId) {
        cy.request('DELETE', `${config.apiUrl}/delete/${objectId}`);
        helpers.wait();
    },

    visitPage(objectId) {
        cy.visit(`${config.frontBaseUrl}/${objectId}/edit`);
        helpers.wait();
    },

};
