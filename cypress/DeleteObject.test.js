const uuid = require('uuid');
const assert = require('chai').assert;
const _ = require('lodash');
const {helpers} = require('../helpers');

helpers.configureCypress();

describe('Delete object', () => {

    const uniqueobjectName = uuid.v4();

    it('Delete a object should not fail', () => {

        helpers.createobject(uniqueobjectName).then(data => {

            helpers.visitEditobjectView(data.body.objectId);

            cy.get('#object-form-view-delete-btn').click();
            helpers.wait();

            cy.get('#delete-modal-confirm-input').type('false input');
            cy.get('#delete-modal-confirm-input').clear();

            cy.get('#delete-modal-delete-button').should('be.disabled');

            cy.get('#delete-modal-confirm-input').type(uniqueobjectName);
            cy.get('#delete-modal-delete-button').click();

            helpers.wait(200);
            helpers.pageShouldNotHaveErrors();

        });

    });

});
