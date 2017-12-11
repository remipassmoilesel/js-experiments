import * as kca from "keycloak-admin-client";
import * as _ from "lodash";
import * as request from "request-promise";
import { AuthSettings } from "./AuthSettings";
import { ClientRepresentation } from "./representations/ClientRepresentation";
import { PolicyRoleBasedRepresentation } from "./representations/PolicyRoleBasedRepresentation";
import { RoleRepresentation } from "./representations/RealmRoleRepresentation";
import { ResourcePermissionRepresentation } from "./representations/ResourcePermissionRepresentation";
import { ResourceRepresentation } from "./representations/ResourceRepresentation";
import { UserRepresentation } from "./representations/UserRepresentation";

export class KeycloakHelper {

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

    public getClient(realmName: string, clientId: string): Promise<ClientRepresentation> {
        return kca(this.authSettings).then((client) => {
            const options = { clientId };
            return client.clients.find(realmName, options).then((clientList) => {
                return clientList[0];
            });
        });
    }

    public createClientRole(realmName: string, clientUID: string,
                            roleRepr: RoleRepresentation) {
        return kca(this.authSettings)
            .then((client) => {
                return client.clients.roles.create(realmName, clientUID, roleRepr);
            });
    }

    public getRealmRolesList(realmName: string): Promise<RoleRepresentation[]> {
        return kca(this.authSettings)
            .then((client) => {
                return client.realms.roles.find(realmName);
            });
    }

    public getRealmRole(realmName: string, roleName: string): Promise<RoleRepresentation> {
        return this.getRealmRolesList(realmName).then((roles) => {
            return _.filter(roles, (r) => {
                return r.name === roleName;
            })[0];
        });
    }

    public getClientRolesList(realmName: string, clientUID: string): Promise<RoleRepresentation[]> {
        return kca(this.authSettings)
            .then((client) => {
                return client.clients.roles.find(realmName, clientUID);
            });
    }

    public getClientRole(realmName: string, clientUID: any, roleName: string) {
        return this.getClientRolesList(realmName, clientUID).then((roles) => {
            return _.filter(roles, (r) => {
                return r.name === roleName;
            })[0];
        });
    }

    public createPolicy(realmName: string, clientUID: string,
                        policyRepr: PolicyRoleBasedRepresentation) {
        return this.getAuth().then((auth) => {
            const options = {
                method: "POST",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/clients/${clientUID}`
                + `/authz/resource-server/policy/role`,
                auth,
                body: policyRepr,
                json: true,
            };
            return request(options);
        });
    }

    public createPermission(realmName: string, clientUID: string,
                            permissionRepr: ResourcePermissionRepresentation) {

        return this.getAuth().then((auth) => {
            const options = {
                method: "POST",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/clients/${clientUID}`
                + `/authz/resource-server/permission/resource`,
                auth,
                body: permissionRepr,
                json: true,
            };
            return request(options);
        });
    }

    public createResource(realmName: string, clientUID: string, resourceRepr: ResourceRepresentation) {

        return this.getAuth().then((auth) => {
            const options = {
                method: "POST",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/clients/${clientUID}` +
                `/authz/resource-server/resource`,
                auth,
                body: resourceRepr,
                json: true,
            };
            return request(options);
        });
    }

    public createPolicyFor(realmName: string, policyName: string, clientName: string, realmRole: string,
                           clientRole: string): Promise<any> {

        return this.getClient(realmName, clientName)
            .then((clientsInfo) => {
                // find client id
                return { clientUID: clientsInfo.id as any };
            })
            .then((data: any) => {
                // find realm role id
                return this.getRealmRole(realmName, realmRole).then((roleInfos) => {
                    data.realmRoleId = roleInfos.id;
                    return data;
                });
            })
            .then((data: any) => {
                // find client role id
                return this.getClientRole(realmName, data.clientUID, clientRole).then((roleInfos) => {
                    data.clientRoleId = roleInfos.id;
                    return data;
                });
            })
            .then((data) => {

                return this.createPolicy(realmName, data.clientUID,
                    {
                        type: "role",
                        logic: "POSITIVE",
                        name: policyName,
                        roles: [
                            { id: data.realmRoleId, required: true },
                            { id: data.clientRoleId, required: true },
                        ],
                    });
            });
    }

    public getResourceInformations(realmName: string, clientUID: string,
                                   resourceUri: string): Promise<ResourceRepresentation> {

        return this.getAuth().then((auth) => {
            const options = {
                method: "GET",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/clients/${clientUID}/authz`
                + `/resource-server/resource?deep=false&first=0&max=20&name=&uri=${resourceUri}`,
                auth,
                json: true,
            };
            return request(options).then((resources) => {
                return resources[0];
            });
        });

    }

    public getPoliciesInformations(realmName: string, clientUID: string,
                                   policyName: string): Promise<ResourcePermissionRepresentation> {

        return this.getAuth().then((auth) => {
            const options = {
                method: "GET",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/clients/${clientUID}`
                + `/authz/resource-server/policy?first=0&max=20&name=${policyName}&permission=false`,
                auth,
                json: true,
            };
            return request(options).then((policies) => {
                return policies[0];
            });
        });

    }

    public createPermissionFor(realmName: string, clientName: string, permissionName: string,
                               resourceUri: string, policyName: string) {

        return this.getClient(realmName, clientName)
            .then((clientsInfo) => {
                // find client id
                return { clientUID: clientsInfo.id as any };
            })
            .then((data: any) => {
                // find resource uid
                return this.getResourceInformations(realmName, data.clientUID, resourceUri).then((resourceRepr) => {
                    data.resourceId = resourceRepr._id;
                    return data;
                });
            })
            .then((data: any) => {
                // find policy uid
                return this.getPoliciesInformations(realmName, data.clientUID, policyName).then((policyInfos) => {
                    data.policyId = policyInfos.id;
                    return data;
                });
            })
            .then((data) => {
                return this.createPermission(realmName, data.clientUID,
                    {
                        type: "resource",
                        logic: "POSITIVE",
                        decisionStrategy: "UNANIMOUS",
                        name: permissionName,
                        resources: [data.resourceId], // TODO: try to allocate more resources in order to create
                                                      // less permissions ?
                        policies: [data.policyId],
                    },
                );
            });

    }

    public createUser(realmName: string, user: UserRepresentation) {
        return kca(this.authSettings)
            .then((client) => {
                client.users.create(realmName, user);
            });
    }

    public findUser(realmName: string, userId: string): Promise<UserRepresentation> {

        return this.getAuth().then((auth) => {

            const options = {
                method: "GET",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/users?first=0&max=20&search=${userId}`,
                auth,
                json: true,
            };

            return request(options).then((users) => {
                return users[0];
            });

        });

    }


    public bindRealmRoleToUser(realmName: string, userId: string, realmRoleName: string) {

        return this.getAuth().then((auth) => {
            return this.getRealmRole(realmName, realmRoleName).then((role) => {

                const options = {
                    method: "POST",
                    uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/users/${userId}/role-mappings/realm`,
                    auth,
                    body: [role],
                    json: true,
                };

                return request(options);
            });
        });

    }

    public bindClientRoleToUser(realmName: string, clientUID, userId: string, clientRoleName: string) {

        return this.getAuth().then((auth) => {
            return this.getClientRole(realmName, clientUID, clientRoleName).then((role) => {

                const options = {
                    method: "POST",
                    uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}`
                    + `/users/${userId}/role-mappings/clients/${clientUID}`,
                    auth,
                    body: [role],
                    json: true,
                };

                return request(options);
            });
        });

    }

    // TODO: finalize
    public evaluate(payload) {

        return this.getAuth().then((auth) => {

            const options = {
                method: "POST",
                uri: `${this.authSettings.baseUrl}/admin/realms/library-poc/clients/
                    clientId/authz/resource-server/policy/evaluate`,
                auth,
                body: payload,
                json: true,
            };

            console.log(options);

            return request(options);
        });
    }

    private getToken() {

        const options = {
            method: "POST",
            uri: `${this.authSettings.baseUrl}/realms/master/protocol/openid-connect/token`,
            form: this.authSettings,
            json: true,
        };

        return request(options).then((data) => {
            return data.access_token;
        });
    }

    private getAuth() {
        return this.getToken().then((accessToken) => {
            return {
                bearer: accessToken,
            };
        });
    }

}
