import { Helper } from './Helper';
import * as chai from 'chai';
import 'mocha';
import { AuthSettings } from '../lib/AuthSettings';
import { ClientRepresentation } from '../lib/ClientRepresentation';

const assert = chai.assert;

describe('Keycloak test', () => {

    const helper = new Helper();
    const keycloakBaseUrl = 'http://172.17.0.3:8080/auth';
    const realmName = 'master';
    const client = 'library-a-client';

    const defaultSettings: AuthSettings = {
        baseUrl: keycloakBaseUrl,
        username: 'keycloak',
        password: 'keycloak',
        grant_type: 'password',
        client_id: 'admin-cli'
    };

    it('List clients should success', () => {
        return helper.getClients(defaultSettings, realmName).then((data: ClientRepresentation[]) => {
            assert.isTrue(data.length > 2);
        });
    });

    it('Create resource should success', () => {
        // /admin/realms/master/clients/6ce026c8-a0d2-4d97-b6e3-59275a9ce918/authz/resource-server/resource
    });

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