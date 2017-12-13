import * as chai from "chai";
import {run, wait} from "f-promise";
import * as fs from "fs-extra";
import * as _ from "lodash";
import "mocha";
import { IAuthSettings } from "../lib/AuthSettings";
import { KeycloakHelper } from "../lib/KeyloakHelper";
import { IResourceRepresentation } from "../lib/representations/IResourceRepresentation";
import { IUserRepresentation } from "../lib/representations/IUserRepresentation";

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

    const roles = ["admin_library-A", "admin_library-B", "user_library-A", "user_library-B"];

    const users = [
        {
            name: "userA",
            roles: ["admin_library-A", "user_library-A", "user_library-B"],
        },
        {
            name: "userB",
            roles: ["admin_library-B", "user_library-B", "user_library-A"],
        },
    ];

    const getResourceUri = (resourceName) => {
        return `${resourceName}`;
    };

    let clientUID;

    const prepareRealm = () => {

        // code is not required in order to avoid errors
        let userJsPolicyCode: string = fs.readFileSync("src/tests/javascript-policy-user.js").toString();
        let adminJsPolicyCode: string = fs.readFileSync("src/tests/javascript-policy-admin.js").toString();

        // create realm
        console.log("Creating realm");
        wait(helper.createRealm(realmName));

        // then create client
        console.log("Creating client");
        const client = wait(helper.createClient(realmName, {
                    clientId: clientName,
                    name: clientName,
                    description: `Description of ${clientName}`,
                    redirectUris: ["http://localhost"],
                    serviceAccountsEnabled: true,
                    authorizationServicesEnabled: true,
                }));
        clientUID = client.id;

        // then create resources
        console.log("Creating resources");

        _.forEach(resources, (resName) => {
            wait(helper.createResource(realmName, clientUID, {
                name: resName,
                scopes: [],
                type: libraryResourceType,
                uri: getResourceUri(resName),
            }));
        });

        // then create roles
        console.log("Creating roles");

        _.forEach(roles, (roleName: string) => {
            wait(helper.createRealmRole(realmName, {
                name: roleName,
                scopeParamRequired: "",
            }));
        });

        // then create policies
        console.log("Creating js policies");


        const adminJsPolicy: any = wait(helper.createJsPolicy(
                realmName,
                clientUID,
                adminJsPolicyName,
                adminJsPolicyCode,
            ));

        const userJsPolicy: any = wait(helper.createJsPolicy(
                        realmName,
                        clientUID,
                        userJsPolicyName,
                        userJsPolicyCode,
                    ));

        // then create permissions
        console.log("Creating permissions");

        wait(helper.createPermission(
                realmName,
                clientUID,
                {
                    name: "Admins can administrate",
                    type: "resource",
                    logic: "POSITIVE",
                    decisionStrategy: "UNANIMOUS",
                    policies: [adminJsPolicy.id],
                    resourceType: libraryResourceType,
                }));

        wait(helper.createPermission(
                        realmName,
                        clientUID,
                        {
                            name: "Users can use",
                            type: "resource",
                            logic: "POSITIVE",
                            decisionStrategy: "UNANIMOUS",
                            policies: [userJsPolicy.id],
                            resourceType: libraryResourceType,
                        }));

        // then create users
        console.log("Creating users");


        _.forEach(users, (user) => {
            wait(helper.createUser(realmName, {
                enabled: true,
                attributes: {},
                username: user.name,
                emailVerified: "",
            }));
        });

        // then map roles
        console.log("Mapping roles");


        _.forEach(users, (user) => {
            const userInfos = wait(helper.getUser(realmName, user.name));
            _.forEach(user.roles, (role) => {
                wait(helper.bindRealmRoleToUser(
                    realmName,
                    (userInfos.id as any),
                    role,
                ));
            });
        });

    };

    before(() => {
        return run(() => {
            try {
                prepareRealm();
            } catch (e) {
                console.log("Error while preparing realm: " + e);
            }

        });

    });

    const evaluate = (resourceName: string, userName: string, status: "PERMIT" | "DENY") => {

        let resource: IResourceRepresentation;
        let user: IUserRepresentation;
        return helper.getResource(realmName, clientUID, resourceName)
            .then((res) => {
                resource = res;
            })
            .then(() => {
                return helper.getUser(realmName, userName)
                    .then((u) => {
                        user = u;
                    });
            })
            .then(() => {
                return helper.evaluate(realmName, clientUID, resource, (user.id as any))
                    .then((evaluation) => {
                        assert.isTrue(evaluation.results.length > 0);
                        _.forEach(evaluation.results, (rslt) => {
                            assert.equal(rslt.status, status);
                        });
                    });
            });

    };

    it("User A should be authorized to administrate library A", () => {
        return evaluate(resources[0], users[0].name, "PERMIT");
    });

    it("User B should be authorized to administrate library B", () => {
        return evaluate(resources[1], users[1].name, "PERMIT");
    });

    it("User A should not be authorized to administrate library B", () => {
        return evaluate(resources[0], users[0].name, "DENY");
    });

    it("User B should not be authorized to administrate library A", () => {
        return evaluate(resources[1], users[1].name, "DENY");
    });

});
