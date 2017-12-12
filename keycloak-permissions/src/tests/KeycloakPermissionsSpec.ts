import * as chai from "chai";
import * as fs from "fs-extra";
import * as _ from "lodash";
import "mocha";
import { IAuthSettings } from "../lib/AuthSettings";
import { KeycloakHelper } from "../lib/KeyloakHelper";

const assert = chai.assert;

describe.only("Keycloak permissions test", function () {

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

    const adminJsPolicyName = "admin-js-policy";
    const userJsPolicyName = "user-js-policy";

    const libraryResourceType = "library";
    const resources = [
        "library-A",
        "library-B",
    ];

    const realmRoles = ["admin_library-A", "admin_library-B", "user_library-A", "user_library-B"];

    const users = [
        {
            name: "userA",
            roles: ["admin_library-A", "user_library-B"],
        },
        {
            name: "userB",
            roles: ["admin_library-B", "user_library-A"],
        },
    ];

    const getResourceUri = (resourceName) => {
        return `${resourceName}`;
    };

    let clientUID = "";
    let userJsPolicy: any = {};
    let adminJsPolicy: any = {};

    // code is not required in order to avoid errors
    let userJsPolicyCode: string = fs.readFileSync("src/tests/javascript-policy-user.js").toString();
    let adminJsPolicyCode: string = fs.readFileSync("src/tests/javascript-policy-admin.js").toString();

    const prepareRealm = () => {

        // create realm
        console.log("Creating realm");
        return helper.createRealm(realmName)
            .then(() => {
                // then create client
                console.log("Creating client");

                return helper.createClient(realmName, {
                    clientId: clientName,
                    name: clientName,
                    description: `Description of ${clientName}`,
                    redirectUris: ["http://localhost"],
                    serviceAccountsEnabled: true,
                    authorizationServicesEnabled: true,
                }).then((data) => {
                    clientUID = data.id;
                });
            })
            .then((data) => {
                // then create resources
                console.log("Creating resources");

                const promises: any[] = [];
                _.forEach(resources, (resName) => {
                    promises.push(helper.createResource(realmName, clientUID, {
                        name: resName,
                        scopes: [],
                        type: libraryResourceType,
                        uri: getResourceUri(resName),
                    }));
                });

                return Promise.all(promises);
            })
            .then(() => {
                // then create realm roles
                console.log("Creating realm roles");

                const promises: Array<Promise<any>> = [];
                _.forEach(realmRoles, (roleName) => {
                    const p = helper.createRealmRole(realmName, {
                        name: roleName,
                        scopeParamRequired: "",
                    });
                    promises.push(p);
                });
                return Promise.all(promises);
            })
            .then(() => {
                // then create policies
                console.log("Creating js policies");

                const promises: Array<Promise<any>> = [];
                promises.push(
                    helper.createJsPolicy(
                        realmName,
                        clientUID,
                        adminJsPolicyName,
                        adminJsPolicyCode,
                    )
                        .then((data) => {
                            adminJsPolicy = data;
                        }),
                );

                promises.push(
                    helper.createJsPolicy(
                        realmName,
                        clientUID,
                        userJsPolicyName,
                        userJsPolicyCode,
                    )
                        .then((data) => {
                            userJsPolicy = data;
                        }),
                );

                return Promise.all(promises);
            })
            .then(() => {
                // then create permissions
                console.log("Creating permissions");

                const promises: Array<Promise<any>> = [];
                promises.push(
                    helper.createPermission(
                        realmName,
                        clientUID,
                        {
                            name: "Admins can administrate",
                            type: "resource",
                            logic: "POSITIVE",
                            decisionStrategy: "UNANIMOUS",
                            policies: [adminJsPolicy.id],
                            resourceType: libraryResourceType,
                        },
                    ),
                );

                promises.push(
                    helper.createPermission(
                        realmName,
                        clientUID,
                        {
                            name: "Users can use",
                            type: "resource",
                            logic: "POSITIVE",
                            decisionStrategy: "UNANIMOUS",
                            policies: [userJsPolicy.id],
                            resourceType: libraryResourceType,
                        },
                    ),
                );

                return Promise.all(promises);

            })
            .then(() => {
                // then create users
                console.log("Creating users");

                const promises: Array<Promise<any>> = [];
                _.forEach(users, (user) => {
                    promises.push(helper.createUser(realmName, {
                        enabled: true,
                        attributes: {},
                        username: user.name,
                        emailVerified: "",
                    }));
                });
                return Promise.all(promises);
            })
            .then(() => {
                // then map roles
                console.log("Mappign realm roles");

                const promises: Array<Promise<any>> = [];
                _.forEach(users, (user) => {
                    promises.push(
                        helper.getUser(realmName, user.name)
                            .then((userInfos) => {
                                _.forEach(user.roles, (role) => {
                                    promises.push(helper.bindRealmRoleToUser(realmName, (userInfos.id as any), role));
                                });
                            }),
                    );
                });

                return Promise.all(promises);
            })
            .catch((e) => {
                console.log(`Error: ${JSON.stringify(e)}`);
                return Promise.reject(e);
            });

    };

    before(() => {
        return prepareRealm();
    });

    it("User A should administrate ", () => {

        // return helper.getClient(realmName, clientName)
        //     .then((clientsInfo) => {
        //         const clientUID: string = clientsInfo.id as any;
        //         return { clientUID };
        //     })
        //     .then((data: any) => {
        //         return helper.getResource(realmName, data.clientUID, resources[0])
        //             .then((res) => {
        //                 data.resource = res;
        //                 return data;
        //             });
        //     })
        //     .then((data: any) => {
        //         return helper.getUser(realmName, users[0].id)
        //             .then((user) => {
        //                 data.user = user;
        //                 return data;
        //             });
        //     })
        //     .then((data: any) => {
        //         return helper.evaluate(realmName, data.clientUID, data.resource, data.user.id);
        //     });

    });

});
