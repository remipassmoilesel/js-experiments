import { Helper } from './Helper';
import * as chai from 'chai';
import * as _ from 'lodash';
import 'mocha';
import { AuthSettings } from '../lib/AuthSettings';
import { ClientRepresentation } from '../lib/ClientRepresentation';

const assert = chai.assert;

describe('Keycloak test', () => {

    const helper = new Helper();
    const keycloakBaseUrl = 'http://172.17.0.3:8080/auth';

    const increment = 3;
    const realmName = `realm-a-${increment}`;
    const clientName = `library-a-client-${increment}`;

    const authSettings: AuthSettings = {
        baseUrl: keycloakBaseUrl,
        username: 'keycloak',
        password: 'keycloak',
        grant_type: 'password',
        client_id: 'admin-cli'
    };

    it.only('Create a realm should success', () => {
        return helper.createRealm(authSettings, realmName);
    });

    it.only('Create a client should success', () => {
        return helper.createClient(authSettings, realmName, {
            clientId: clientName,
            name: clientName,
            description: `Description of ${clientName}`,
            redirectUris: ['http://localhost']
        });
    });

    it('List clients should success', () => {
        return helper.getClients(authSettings, realmName).then((data: ClientRepresentation[]) => {
            assert.isTrue(data.length > 2);
        });
    });

    // it('Create resource should success', () => {
    //     return helper.getClients(authSettings, realmName)
    //         .then((clients: ClientRepresentation[]) => {
    //
    //             return _.filter(clients, (cl: ClientRepresentation) => {
    //                 return cl.clientId == clientName;
    //             })[0];
    //
    //         })
    //         .then((targetClient: ClientRepresentation) => {
    //
    //             const promises: Promise<any>[] = [];
    //             for (let i = 0; i < 10; i++) {
    //                 const resId = `resource-${i}-${new Date().toISOString()}`;
    //                 const p = helper.createResource(authSettings, realmName, targetClient.id, {
    //                     name: resId,
    //                     scopes: [],
    //                     uri: `uri:${resId}`,
    //                 });
    //
    //                 promises.push(p);
    //             }
    //
    //             return Promise.all(promises);
    //         });
    // });


    it.skip('evaluate should success', () => {

        // TODO: finalize

        // const config: AuthSettings = {
        //     evaluatePath: '/admin/realms/library-poc/clients/e47e0f0d-2932-4d7f-8533-1f7eac9305cf/authz/resource-server/policy/evaluate',
        //     baseUrl: keycloakBaseUrl,
        //     username: 'keycloak',
        //     password: 'keycloak',
        //     grant_type: 'password',
        //     client_id: 'admin-cli'
        // };
        //
        // const payload = {
        //     'resources': [{
        //         'name': 'library_a',
        //         'uri': '/library-a',
        //         'type': 'library-api:library',
        //         'owner': { 'id': 'e47e0f0d-2932-4d7f-8533-1f7eac9305cf', 'name': 'library_api' },
        //         '_id': '6ae3b27b-4b43-413b-b5f9-81d79a89a189',
        //         'scopes': ['Edit']
        //     }],
        //     'context': { 'attributes': {} },
        //     'roleIds': ['library_administrator'],
        //     'clientId': 'e47e0f0d-2932-4d7f-8533-1f7eac9305cf',
        //     'userId': '2c594d05-6ecb-4f86-9df8-ca9933aec6ba',
        //     'entitlements': false
        // };
        //
        // return helper.evaluate(config, payload);

    });

});