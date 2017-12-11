import { Helper } from './Helper';
import * as chai from 'chai';
import 'mocha';
import { AuthSettings } from '../lib/AuthSettings';

const assert = chai.assert;

describe('Keycloak test', () => {

    const keycloakBaseUrl = 'http://172.17.0.3:8080/auth';
    const authSettings: AuthSettings = {
        baseUrl: keycloakBaseUrl,
        username: 'keycloak',
        password: 'keycloak',
        grant_type: 'password',
        client_id: 'admin-cli'
    };


    const helper = new Helper(authSettings);

    const increment = new Date().toISOString().replace(/[-:.]+/ig, '');
    const realmName = `${increment}`;
    const clientName = `000-library-client-a`;

    const adminRoleName = 'admin';
    const authorizedUserRoleName = 'authorized_user';

    it('Create a realm should success', () => {
        return helper.createRealm(realmName);
    });

    it('Create a client should success', () => {
        return helper.createClient(realmName, {
            clientId: clientName,
            name: clientName,
            description: `Description of ${clientName}`,
            redirectUris: ['http://localhost'],
            serviceAccountsEnabled: true,
            authorizationServicesEnabled: true,
        });
    });

    it('Create realm roles should success', () => {
        const promises: Promise<any>[] = [];
        promises.push(helper.createRealmRole(realmName, {
            name: adminRoleName,
            scopeParamRequired: ''
        }));
        promises.push(helper.createRealmRole(realmName, {
            name: authorizedUserRoleName,
            scopeParamRequired: ''
        }));

        return Promise.all(promises);
    });

    it('Get client informations from clientId should success', () => {
        return helper.getInformationsForClients(realmName, clientName);
    });

    it('Create a client role should success', () => {
        return helper.getInformationsForClients(realmName, clientName)
            .then((clientsInfo) => {
                const clientUid: string = clientsInfo[0].id as any;
                const promises: Promise<any>[] = [];
                promises.push(helper.createClientRole(realmName, clientUid, {
                    name: adminRoleName,
                    scopeParamRequired: ''
                }));
                promises.push(helper.createClientRole(realmName, clientUid, {
                    name: authorizedUserRoleName,
                    scopeParamRequired: ''
                }));

                return Promise.all(promises);
            });
    });

    it('Get realm role informations should success', () => {
        return helper.getInformationsForClients(realmName, clientName).then((clientsInfo) => {

            const clientUID: string = clientsInfo[0].id as any;
            const promises: Promise<any>[] = [];
            promises.push(helper.getInformationsForRealmRoles(realmName, clientUID).then((rolesInfos) => {
                assert.isTrue(rolesInfos.length > 1);
            }));
            promises.push(helper.getRealmRoleInfos(realmName, clientUID, adminRoleName).then((rolesInfo) => {
                assert.isDefined(rolesInfo);
            }));

            return Promise.all(promises);
        });

    });

    it('Get client role informations should success', () => {
        return helper.getInformationsForClients(realmName, clientName).then((clientsInfo) => {

            const clientUID: string = clientsInfo[0].id as any;
            const promises: Promise<any>[] = [];
            promises.push(helper.getInformationsForClientsRoles(realmName, clientUID).then((rolesInfos) => {
                assert.isTrue(rolesInfos.length > 1);
            }));
            promises.push(helper.getClientRoleInfos(realmName, clientUID, adminRoleName).then((rolesInfo) => {
                assert.isDefined(rolesInfo);
            }));

            return Promise.all(promises);
        });

    });

    it('Create policies should success', () => {

        return helper.getInformationsForClients(realmName, clientName)
            .then((clientsInfo) => {
                // find client id
                return { clientUID: clientsInfo[0].id as any };
            })
            .then((data: any) => {
                // find admin realm role id
                return helper.getRealmRoleInfos(realmName, data.clientUID, adminRoleName).then((roleInfos) => {
                    data.realmAdminRoleId = roleInfos.id;
                    return data;
                });
            })
            .then((data: any) => {
                // find user realm role id
                return helper.getRealmRoleInfos(realmName, data.clientUID, authorizedUserRoleName).then((roleInfos) => {
                    data.realmAuthorizedUserRoleId = roleInfos.id;
                    return data;
                });
            })
            .then((data: any) => {
                // find admin client role id
                return helper.getClientRoleInfos(realmName, data.clientUID, adminRoleName).then((roleInfos) => {
                    data.realmAdminRoleId = roleInfos.id;
                    return data;
                });
            })
            .then((data: any) => {
                // find user realm role id
                return helper.getRealmRoleInfos(realmName, data.clientUID, authorizedUserRoleName).then((roleInfos) => {
                    data.realmAuthorizedUserRoleId = roleInfos.id;
                    return data;
                });
            });
        // .then((data) => {
        //     { clientUID: '6b2f4059-c5c8-4332-a6c5-6c3fa37342a7',
        //         adminRoleId: '012b2567-e1e0-44a2-bca9-5d4c77df2155',
        //         authorizedUserRoleId: '92bfa891-5cdd-4289-b8e7-aa7bff21ad22' }
        //
        //     console.log(data);
        // });

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