import * as request from 'request-promise';
import { AuthSettings } from './AuthSettings';
import { ClientRepresentation } from './ClientRepresentation';
import * as kca from 'keycloak-admin-client';
import * as _ from 'lodash';
import { RoleRepresentation } from './RealmRoleRepresentation';
import { PolicyRoleBasedRepresentation } from './PolicyRoleBasedRepresentation';
import { ResourceRepresentation } from './ResourceRepresentation';

export class Helper {
    private authSettings: AuthSettings;

    constructor(settings: AuthSettings) {
        this.authSettings = settings;
    }

    public createRealm(realmName: string): Promise<any> {
        return kca(this.authSettings).then((client) => {
            return client.realms.create({ realm: realmName });
        });
    }

    public createClient(realmName: string, clientRepr: ClientRepresentation): Promise<any> {
        return kca(this.authSettings).then((client) => {
            return client.clients.create(realmName, clientRepr);
        });
    }

    public createRealmRole(realmName: string, roleRepr: RoleRepresentation): Promise<any> {
        return kca(this.authSettings).then((client) => {
            return client.realms.roles.create(realmName, roleRepr);
        });
    }

    public getInformationsForClients(realmName: string, clientId: string): Promise<ClientRepresentation[]> {
        return kca(this.authSettings).then((client) => {
            const options = { clientId };
            return client.clients.find(realmName, options);
        });
    }

    public createClientRole(realmName: string, clientUID: string,
                            roleRepr: RoleRepresentation) {
        return kca(this.authSettings)
            .then((client) => {
                return client.clients.roles.create(realmName, clientUID, roleRepr);
            });
    }

    public getInformationsForRealmRoles(realmName: string, clientUID: string): Promise<RoleRepresentation[]> {
        return kca(this.authSettings)
            .then((client) => {
                return client.realms.roles.find(realmName);
            });
    }

    public getRealmRoleInfos(realmName: string, clientUID: string, roleName: string): Promise<RoleRepresentation> {
        return this.getInformationsForRealmRoles(realmName, clientUID).then((roles) => {
            return _.filter(roles, (r) => {
                return r.name === roleName;
            })[0];
        });
    }

    public getInformationsForClientsRoles(realmName: string, clientUID: string): Promise<RoleRepresentation[]> {
        return kca(this.authSettings)
            .then((client) => {
                return client.clients.roles.find(realmName, clientUID);
            });
    }

    public getClientRoleInfos(realmName: string, clientUID: any, roleName: string) {
        return this.getInformationsForClientsRoles(realmName, clientUID).then((roles) => {
            return _.filter(roles, (r) => {
                return r.name === roleName;
            })[0];
        });
    }

    public createPolicy(realmName: string, clientUID: string,
                        policyRepr: PolicyRoleBasedRepresentation) {
        return this.getAuth().then((auth) => {
            const options = {
                method: 'POST',
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/clients/${clientUID}/authz/resource-server/policy/role`,
                auth: auth,
                body: policyRepr,
                json: true
            };
            return request(options);
        });
    }

    public createResource(realmName: string, clientUID: string, resourceRepr: ResourceRepresentation) {

        return this.getAuth().then((auth) => {
            const options = {
                method: 'POST',
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/clients/${clientUID}/authz/resource-server/resource`,
                auth: auth,
                body: resourceRepr,
                json: true
            };
            return request(options);
        });
    }

    public createPolicyFor(realmName: string, policyName: string, clientName: string, realmRole: string, clientRole: string) {

        return this.getInformationsForClients(realmName, clientName)
            .then((clientsInfo) => {
                // find client id
                return { clientUID: clientsInfo[0].id as any };
            })
            .then((data: any) => {
                // find realm role id
                return this.getRealmRoleInfos(realmName, data.clientUID, realmRole).then((roleInfos) => {
                    data.realmRoleId = roleInfos.id;
                    return data;
                });
            })
            .then((data: any) => {
                // find client role id
                return this.getClientRoleInfos(realmName, data.clientUID, clientRole).then((roleInfos) => {
                    data.clientRoleId = roleInfos.id;
                    return data;
                });
            })
            .then((data) => {

                return this.createPolicy(realmName, data.clientUID,
                    {
                        type: 'role',
                        logic: 'POSITIVE',
                        name: policyName,
                        roles: [
                            { id: data.realmRoleId, required: true },
                            { id: data.clientRoleId, required: true },
                        ],
                    });
            });
    }


    // TODO: finalize
    public evaluate(payload) {

        return this.getAuth().then((auth) => {

            const options = {
                method: 'POST',
                uri: `${this.authSettings.baseUrl}/admin/realms/library-poc/clients/e47e0f0d-2932-4d7f-8533-1f7eac9305cf/authz/resource-server/policy/evaluate`,
                auth: auth,
                body: payload,
                json: true
            };

            console.log(options);

            return request(options);
        });
    }


    private getToken() {

        const options = {
            method: 'POST',
            uri: `${this.authSettings.baseUrl}/realms/master/protocol/openid-connect/token`,
            form: this.authSettings,
            json: true
        };

        return request(options).then((data) => {
            return data.access_token;
        });
    }

    private getAuth() {
        return this.getToken().then((accessToken) => {
            return {
                bearer: accessToken
            };
        });
    }

}