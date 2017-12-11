import { Helper } from './Helper';
import * as chai from 'chai';
import 'mocha';

const assert = chai.assert;

describe('Keycloak test', () => {

    const helper = new Helper();
    const keycloakBaseUrl = 'http://172.17.0.3:8080/auth';
    const realm = 'master';
    const client = 'library-a-client';

    const settings = {
        baseUrl: keycloakBaseUrl,
        username: 'keycloak',
        password: 'keycloak',
        grant_type: 'password',
        client_id: 'admin-cli'
    };

    it('evaluate should success', () => {

        const config = {
            openidConnectPath: '/realms/master/protocol/openid-connect/token',
            evaluatePath: '/admin/realms/library-poc/clients/e47e0f0d-2932-4d7f-8533-1f7eac9305cf/authz/resource-server/policy/evaluate',
            baseUrl: keycloakBaseUrl,
            username: 'keycloak',
            password: 'keycloak',
            grant_type: 'password',
            client_id: 'admin-cli'
        };

        const payload = {
            'resources': [{
                'name': 'library_a',
                'uri': '/library-a',
                'type': 'library-api:library',
                'owner': { 'id': 'e47e0f0d-2932-4d7f-8533-1f7eac9305cf', 'name': 'library_api' },
                '_id': '6ae3b27b-4b43-413b-b5f9-81d79a89a189',
                'scopes': ['Edit']
            }],
            'context': { 'attributes': {} },
            'roleIds': ['library_administrator'],
            'clientId': 'e47e0f0d-2932-4d7f-8533-1f7eac9305cf',
            'userId': '2c594d05-6ecb-4f86-9df8-ca9933aec6ba',
            'entitlements': false
        };

        return helper.evaluate(config, payload);

    });

});