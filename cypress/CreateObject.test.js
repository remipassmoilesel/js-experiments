const uuid = require('uuid');
const assert = require('chai').assert;
const {helpers} = require('../helpers');

helpers.configureCypress();

describe('Create Object', () => {

    const uniqueObjectName = uuid.v4();
    let objectId = "";

    it('Creation should not fail', () => {

        // go to create object page
        cy.visit("/");
        cy.get('#navbar-show-object').click();
        helpers.wait();

        cy.get('#create-object-button').click();
        helpers.wait();

        // fill form and submit
        cy.get('#root_alias').type(uniqueObjectName);
        cy.get('#root_urls_0_path').type('/' + uniqueObjectName);
        helpers.wait();

        cy.get('#form-main').submit();
        helpers.wait();

        // ensure we have not errors
        helpers.pageShouldNotHaveErrors();

        // then delete temp object
        cy.get('#root_objectId').then((objectIdField) => {
            objectId = objectIdField.val();
        });

    });

    it('Subsequent creation with same path should fail', () => {

        // go to create object page
        cy.visit("/");
        cy.get('#navbar-show-object').click();
        helpers.wait();
        cy.get('#create-object-button').click();
        helpers.wait();

        // fill form and submit
        cy.get('#root_alias').type(uniqueObjectName);
        cy.get('#root_urls_0_path').type('/' + uniqueObjectName);
        helpers.wait();

        cy.get('#form-main').submit();
        helpers.wait();

        // ensure we have not errors
        helpers.pageShouldHaveErrors();

        helpers.deleteobject(objectId);
        helpers.wait(700);
    });

});
