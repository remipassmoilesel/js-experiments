import * as chai from "chai";
import * as _ from "lodash";
import "mocha";
import { IAuthSettings } from "../lib/AuthSettings";
import { KeycloakHelper } from "../lib/KeyloakHelper";

const assert = chai.assert;

describe("Keycloak test", function () {

    this.timeout(5000);

    const keycloakBaseUrl = "http://172.17.0.3:8080/auth";
    const authSettings: IAuthSettings = {
        baseUrl: keycloakBaseUrl,
        username: "keycloak",
        password: "keycloak",
        grant_type: "password",
        client_id: "admin-cli",
    };


    const helper = new KeycloakHelper(authSettings);

    const increment = new Date().toISOString().replace(/[-:.]+/ig, "");
    const realmName = `${increment}`;
    const clientName = `000-library-client-a`;

    const adminRoleName = "admin";
    const authorizedUserRoleName = "authorized_user";

    const users = [
        { id: "user1", roles: [] },
        { id: "user2", roles: [] },
    ];

    const getAdminRoleName = (resourceName) => {
        return `${adminRoleName}-${resourceName}`;
    };

    const getAuthorizedUserRoleName = (resourceName) => {
        return `${authorizedUserRoleName}-${resourceName}`;
    };

    const getAdminPolicyName = (resourceName) => {
        return `Admins can administrate ${resourceName}`;
    };

    const getAuthorizedUserPolicyName = (resourceName) => {
        return `Users can use ${resourceName}`;
    };

    const getAdminPermissionName = (resourceName) => {
        return `Permission - Admins can administrate ${resourceName}`;
    };

    const getAuthorizedUserPermissionName = (resourceName) => {
        return `Permission - Users can use ${resourceName}`;
    };

    const getResourceUri = (resourceName) => {
        return `uri:id:${resourceName}`;
    };

    const resources = [
        "library-A",
        "library-B",
        "library-C",
    ];

    it("Create a realm should success", () => {
        return helper.createRealm(realmName);
    });

    it("Create a client should success", () => {
        return helper.createClient(realmName, {
            clientId: clientName,
            name: clientName,
            description: `Description of ${clientName}`,
            redirectUris: ["http://localhost"],
            serviceAccountsEnabled: true,
            authorizationServicesEnabled: true,
        });
    });

    it("Create resources should success", () => {

        return helper.getClient(realmName, clientName).then((clientsInfo) => {

            const clientUID: string = clientsInfo.id as any;
            const promises = _.forEach(resources, (resName) => {
                return helper.createResource(realmName, clientUID, {
                    name: resName,
                    scopes: [],
                    uri: getResourceUri(resName),
                });
            });

            return Promise.all(promises);
        });

    });

    it("Create realm roles should success", () => {
        const promises: Array<Promise<any>> = [];

        _.forEach(resources, (resName) => {

            promises.push(helper.createRealmRole(realmName, {
                name: getAdminRoleName(resName),
                scopeParamRequired: "",
            }));

            promises.push(helper.createRealmRole(realmName, {
                name: getAuthorizedUserRoleName(resName),
                scopeParamRequired: "",
            }));

        });

        return Promise.all(promises);
    });

    it("Get client informations from clientId should success", () => {
        return helper.getClient(realmName, clientName);
    });

    it("Create a client role should success", () => {
        return helper.getClient(realmName, clientName)
            .then((clientInfo) => {

                const clientUid: string = clientInfo.id as any;
                const promises: Array<Promise<any>> = [];

                _.forEach(resources, (resName) => {

                    promises.push(helper.createClientRole(realmName, clientUid, {
                        name: getAdminRoleName(resName),
                        scopeParamRequired: "",
                    }));

                    promises.push(helper.createClientRole(realmName, clientUid, {
                        name: getAuthorizedUserRoleName(resName),
                        scopeParamRequired: "",
                    }));

                });

                return Promise.all(promises);
            });
    });

    it("Get realm role informations should success", () => {
        return helper.getClient(realmName, clientName).then((clientsInfo) => {

            const clientUID: string = clientsInfo.id as any;
            const promises: Array<Promise<any>> = [];
            promises.push(helper.getRealmRolesList(realmName).then((rolesInfos) => {
                assert.isTrue(rolesInfos.length > 1);
            }));
            promises.push(helper.getRealmRole(realmName, getAdminRoleName(resources[0])).then((rolesInfo) => {
                assert.isDefined(rolesInfo);
            }));

            return Promise.all(promises);
        });

    });

    it("Get client role informations should success", () => {
        return helper.getClient(realmName, clientName).then((clientsInfo) => {

            const clientUID: string = clientsInfo.id as any;
            const promises: Array<Promise<any>> = [];
            promises.push(helper.getClientRolesList(realmName, clientUID).then((rolesInfos) => {
                assert.isTrue(rolesInfos.length > 1);
            }));
            promises.push(helper.getClientRole(realmName, clientUID,
                getAdminRoleName(resources[0])).then((rolesInfo) => {
                assert.isDefined(rolesInfo);
            }));

            return Promise.all(promises);
        });

    });

    it("Create policies should success", () => {

        const promises: Array<Promise<any>> = [];
        _.forEach(resources, (res) => {
            promises.push(helper.createPolicyFor(realmName, getAdminPolicyName(res),
                clientName, getAdminRoleName(res), getAdminRoleName(res)));

            promises.push(helper.createPolicyFor(realmName, getAuthorizedUserPolicyName(res),
                clientName, getAuthorizedUserRoleName(res), getAuthorizedUserRoleName(res)));
        });

    });

    it("Get informations on resource should success", () => {

        return helper.getClient(realmName, clientName).then((clientsInfo) => {
            const clientUID: string = clientsInfo.id as any;
            return helper.getResourceInformations(realmName, clientUID, getResourceUri(resources[0]))
                .then((infos) => {
                    assert.isDefined(infos);
                });
        });

    });

    it("Get informations on policy should success", () => {

        return helper.getClient(realmName, clientName).then((clientsInfo) => {
            const clientUID: string = clientsInfo.id as any;
            return helper.getPoliciesInformations(realmName, clientUID, getAdminPolicyName(resources[0]))
                .then((infos) => {
                    assert.isDefined(infos);
                });
        });

    });

    it("Create permissions should success", () => {

        const promises: Array<Promise<any>> = [];
        _.forEach(resources, (res) => {
            promises.push(helper.createPermissionFor(
                realmName,
                clientName,
                getAdminPermissionName(res),
                res,
                getAdminPolicyName(res),
            ));

            promises.push(helper.createPermissionFor(
                realmName,
                clientName,
                getAuthorizedUserPermissionName(res),
                res,
                getAuthorizedUserPolicyName(res),
            ));

        });

        return Promise.all(promises);

    });

    it("Create users should success", () => {
        const promises: Array<Promise<any>> = [];

        _.forEach(users, (user) => {
            promises.push(helper.createUser(realmName, {
                enabled: true,
                attributes: {},
                username: user.id,
                emailVerified: "",
            }));
        });

        return Promise.all(promises);
    });

    it("Get user informations should success", () => {
        return helper.findUser(realmName, users[0].id).then((user) => {
            assert.isDefined(user);
        });
    });

    it("Map realm role to user should success", () => {
        const promises: Array<Promise<any>> = [];

        _.forEach(users, (user) => {
            promises.push(
                helper.findUser(realmName, user.id)
                    .then((userInfo) => {
                        helper.bindRealmRoleToUser(realmName, (userInfo.id as any), getAdminRoleName(resources[0]));
                    }));
        });

        return Promise.all(promises);
    });

    it("Map client role to user should success", () => {

        return helper.getClient(realmName, clientName).then((clientsInfo) => {
            const clientUID: string = clientsInfo.id as any;

            const promises: Array<Promise<any>> = [];

            _.forEach(users, (user) => {
                promises.push(
                    helper.findUser(realmName, user.id).then((userInfo) => {
                        helper.bindClientRoleToUser(realmName, clientUID, (userInfo.id as any),
                            getAdminRoleName(resources[0]));
                    }));
            });

            return Promise.all(promises);

        });

    });

    it("Evaluate should success", () => {
        // const a = {
        //     resources: [{
        //         name: "library-A",
        //         uri: "uri:id:library-A",
        //         owner: { id: "d159e9a7-0755-4c3c-86e8-23083c7727a3", name: "000-library-client-a" },
        //         _id: "b242e010-e9a5-41c9-ac70-dd2dfc5cfc6b",
        //         scopes: [],
        //     }],
        //     context: { attributes: {} },
        //     roleIds: [],
        //     clientId: "d159e9a7-0755-4c3c-86e8-23083c7727a3",
        //     userId: "7902ebca-2afd-4a83-9383-b3ff327e97cb",
        //     entitlements: false,
        // };
        // return helper.evaluate(realmName, users[0].id);

    });

});
