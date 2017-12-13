import * as kca from "keycloak-admin-client";
import * as _ from "lodash";
import * as request from "request-promise";
import { IAuthSettings } from "./AuthSettings";
import { IEvaluationPayload } from "./IEvaluationPayload";
import { IJsPolicyPayload } from "./IJsPolicyPayload";
import { IClientRepresentation } from "./representations/IClientRepresentation";
import { IGroupRepresentation } from "./representations/IGroupRepresentation";
import { IPolicyRoleBasedRepresentation } from "./representations/IPolicyRoleBasedRepresentation";
import { IRoleRepresentation } from "./representations/IRealmRoleRepresentation";
import { IResourcePermissionRepresentation } from "./representations/IResourcePermissionRepresentation";
import { IResourceRepresentation } from "./representations/IResourceRepresentation";
import { IUserRepresentation } from "./representations/IUserRepresentation";

export class KeycloakHelper {

    private authSettings: IAuthSettings;

    constructor(settings: IAuthSettings) {
        this.authSettings = settings;
    }

    public createRealm(realmName: string): Promise<any> {
        return this.getAuth().then((auth) => {

            const payload = {
                enabled: true,
                id: realmName,
                realm: realmName,
            };

            const options = {
                method: "POST",
                uri: `${this.authSettings.baseUrl}/admin/realms`,
                auth,
                body: payload,
                json: true,
            };
            return request(options);

        });
    }

    public createClient(realmName: string, clientRepr: IClientRepresentation): Promise<any> {
        return kca(this.authSettings).then((client) => {
            return client.clients.create(realmName, clientRepr);
        });
    }

    public createRealmRole(realmName: string, roleRepr: IRoleRepresentation): Promise<any> {
        return kca(this.authSettings).then((client) => {
            return client.realms.roles.create(realmName, roleRepr);
        });
    }

    public getClient(realmName: string, clientId: string): Promise<IClientRepresentation> {
        return kca(this.authSettings).then((client) => {
            const options = { clientId };
            return client.clients.find(realmName, options).then((clientList) => {
                return clientList[0];
            });
        });
    }

    public createClientRole(realmName: string, clientUID: string,
                            roleRepr: IRoleRepresentation) {
        return kca(this.authSettings)
            .then((client) => {
                return client.clients.roles.create(realmName, clientUID, roleRepr);
            });
    }

    public getRealmRolesList(realmName: string): Promise<IRoleRepresentation[]> {
        return kca(this.authSettings)
            .then((client) => {
                return client.realms.roles.find(realmName);
            });
    }

    public getRealmRole(realmName: string, roleName: string): Promise<IRoleRepresentation> {
        return this.getRealmRolesList(realmName).then((roles) => {
            return _.filter(roles, (r) => {
                return r.name === roleName;
            })[0];
        });
    }

    public getClientRolesList(realmName: string, clientUID: string): Promise<IRoleRepresentation[]> {
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
                        policyRepr: IPolicyRoleBasedRepresentation) {
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
                            permissionRepr: IResourcePermissionRepresentation) {

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

    public createResource(realmName: string, clientUID: string, resourceRepr: IResourceRepresentation) {

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

    public getResource(realmName: string, clientUID: string,
                       resourceUri: string): Promise<IResourceRepresentation> {

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

    public getPolicy(realmName: string, clientUID: string,
                     policyName: string): Promise<IResourcePermissionRepresentation> {

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
                return this.getResource(realmName, data.clientUID, resourceUri).then((resourceRepr) => {
                    data.resourceId = resourceRepr._id;
                    return data;
                });
            })
            .then((data: any) => {
                // find policy uid
                return this.getPolicy(realmName, data.clientUID, policyName).then((policyInfos) => {
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

    public createUser(realmName: string, user: IUserRepresentation) {
        return kca(this.authSettings)
            .then((client) => {
                client.users.create(realmName, user);
            });
    }

    public getUser(realmName: string, userId: string): Promise<IUserRepresentation> {

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

    public createGroup(realmName: string, groupName: string): Promise<any> {

        return this.getAuth().then((auth) => {

            const options = {
                method: "POST",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/groups`,
                body: { name: groupName },
                auth,
                json: true,
            };

            return request(options);
        });

    }

    public bindGroup(realmName: string, userUID: string, groupUID: string): Promise<any> {

        return this.getAuth().then((auth) => {

            const payload = {
                realm: realmName,
                userId: userUID,
                groupId: groupUID,
            };

            const options = {
                method: "PUT",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/users/${userUID}/groups/${groupUID}`,
                body: payload,
                auth,
                json: true,
            };

            return request(options);
        });

    }

    public bindRealmRoleToUser(realmName: string, userUID: string, realmRoleName: string) {

        return this.getAuth().then((auth) => {
            return this.getRealmRole(realmName, realmRoleName).then((role) => {

                const options = {
                    method: "POST",
                    uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/users/${userUID}/role-mappings/realm`,
                    auth,
                    body: [role],
                    json: true,
                };

                return request(options);
            });
        });

    }

    public bindClientRoleToUser(realmName: string, clientUID, userUID: string, clientRoleName: string) {

        return this.getAuth().then((auth) => {
            return this.getClientRole(realmName, clientUID, clientRoleName).then((role) => {

                const options = {
                    method: "POST",
                    uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}`
                    + `/users/${userUID}/role-mappings/clients/${clientUID}`,
                    auth,
                    body: [role],
                    json: true,
                };

                return request(options);
            });
        });

    }

    public evaluate(realmName: string, clientUID: string, resource: IResourceRepresentation, userUID: string) {

        return this.getAuth().then((auth) => {

            const payload: IEvaluationPayload = {
                resources: [resource],
                context: { attributes: {} },
                roleIds: [],
                clientId: clientUID,
                userId: userUID,
                entitlements: false,
            };

            const options = {
                method: "POST",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}`
                + `/clients/${clientUID}/authz/resource-server/policy/evaluate`,
                auth,
                body: payload,
                json: true,
            };

            return request(options);
        });
    }

    public createJsPolicy(realmName: string, clientUID: string, policyName: string, policyJsCode: string) {

        return this.getAuth().then((auth) => {

            const payload: IJsPolicyPayload = {
                type: "js",
                logic: "POSITIVE",
                name: policyName,
                description: policyName,
                code: policyJsCode,
            };

            const options = {
                method: "POST",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}`
                + `/clients/${clientUID}/authz/resource-server/policy/js`,
                auth,
                body: payload,
                json: true,
            };

            return request(options);
        });

    }

    public getGroups(realmName: string): Promise<IGroupRepresentation[]> {

        return this.getAuth().then((auth) => {

            const options = {
                method: "GET",
                uri: `${this.authSettings.baseUrl}/admin/realms/${realmName}/groups`,
                auth,
                json: true,
            };

            return request(options);
        });

    }

    public getGroup(realmName: string, groupName: string): Promise<IGroupRepresentation> {
        return this.getGroups(realmName).then((groups: IGroupRepresentation[]) => {
            return _.filter(groups, (gr: IGroupRepresentation) => {
                return gr.name === groupName;
            })[0];
        });
    }

    public createScope(realmName: string, clientUID: string, scopeName: string) {

        return this.getAuth().then((auth) => {
            const options = {
                method: "POST",
                uri: `${this.authSettings.baseUrl}/admin`
                    + `/realms/${realmName}/clients/${clientUID}/authz/resource-server/scope`,
                auth,
                body: {name: scopeName},
                json: true,
            };

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
