const uuid = require('uuid');
const assert = require('chai').assert;
const _ = require('lodash');
const {helpers} = require('../helpers');

helpers.configureCypress();

describe('object forms', () => {

    const uniqueObjectName = uuid.v4();

    const tabSelectors = [
        '#tab-link-tab1',
        '#tab-link-tab2',
        '#tab-link-tab3',
        '#tab-link-tab4',
    ];
    const submitButtonsSelectors = [
        '#form-submit-1',
        '#form-submit-2',
        '#form-submit-3',
        '#form-submit-4',
    ];

    it('Validate all forms with default data should not fail', () => {

        helpers.createObjectWithXhrRequest(uniqueObjectName).then(data => {

            const objectId = data.body.objectId;

            _.forEach(submitButtonsSelectors, (btnSelector, index) => {

                helpers.visitEditobjectView(objectId);

                cy.get(tabSelectors[index]).click();
                helpers.wait();

                cy.get(btnSelector).click();
                helpers.wait(800);

                helpers.pageShouldNotHaveErrors();

            });

            helpers.deleteobject(objectId);
        });

    });

});
