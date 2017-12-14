import * as chai from "chai";
import { create } from "domain";
import { run, wait } from "f-promise";
import * as fs from "fs-extra";
import * as _ from "lodash";
import "mocha";
import { IAuthSettings } from "../../lib/AuthSettings";
import { KeycloakHelper } from "../../lib/KeyloakHelper";
import { IResourceRepresentation } from "../../lib/representations/IResourceRepresentation";
import { IUserRepresentation } from "../../lib/representations/IUserRepresentation";

const assert = chai.assert;

describe("Keycloak permissions scenario 3", function () {

    this.timeout(10000);

    const keycloakBaseUrl = "http://172.17.0.3:8080/auth";
    const authSettings: IAuthSettings = {
        baseUrl: keycloakBaseUrl,
        username: "keycloak",
        password: "keycloak",
        grant_type: "password",
        client_id: "admin-cli",
    };

    const helper = new KeycloakHelper(authSettings);

    const realmName = `policejs-3-${new Date().toISOString().replace(/[-:.]+/ig, "")}`;
    const clientName = `000-library-client-a`;

    const jsPolicyName = "library-policy";
    const libraryResourceType = "library";

    const libraryA = "library-A";
    const libraryB = "library-B";
    const resources = [libraryA, libraryB];

    const userA = "user-a";
    const userB = "user-b";

    const createScope = "CREATE";
    const readScope = "READ";
    const updateScope = "UPDATE";
    const deleteScope = "DELETE";

    const scopeNames = [createScope, readScope, updateScope, deleteScope];

    const users = [
        {
            name: userA,
            attributes: {
                scopeMap: {
                    [libraryA]: [createScope, readScope, updateScope, deleteScope],
                    [libraryB]: [readScope],
                },
            },
        },
        {
            name: userB,
            attributes: {
                scopeMap: {
                    [libraryA]: [readScope],
                    [libraryB]: [createScope, readScope, updateScope, deleteScope],
                },
            },
        },
    ];

    let clientUID;

    const prepareRealm = () => {

        // code is not required in order to avoid errors for undefined variables
        let jsPolicyCodePartial = fs.readFileSync("src/tests/permission-scenario-3/javascript-policy.js").toString();
        let jsPolicyVariables = fs.readFileSync("src/tests/permission-scenario-3/javascript-policy-variables.js").toString();
        let jsPolicy: string = jsPolicyVariables + jsPolicyCodePartial;

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

        // then create scopes
        console.log("Creating scopes");
        const scopesRepr = [];
        _.forEach(scopeNames, (scopeName) => {
            scopesRepr.push(wait(helper.createScope(realmName, clientUID, scopeName)));
        });

        // then create resources
        console.log("Creating resources");

        _.forEach(resources, (resName) => {
            wait(helper.createResource(realmName, clientUID, {
                name: resName,
                scopes: scopesRepr,
                type: libraryResourceType,
                uri: resName,
            }));
        });

        // then create policies
        console.log("Creating js policy");

        const jsPolicyRepr: any = wait(helper.createJsPolicy(
            realmName,
            clientUID,
            jsPolicyName,
            jsPolicy,
        ));

        // then create permissions
        console.log("Creating permission");

        wait(helper.createPermission(
            realmName,
            clientUID,
            {
                name: "JS Permission",
                type: "resource",
                logic: "POSITIVE",
                decisionStrategy: "AFFIRMATIVE",
                policies: [jsPolicyRepr.id],
                resourceType: libraryResourceType,
            }));

        // then create users
        console.log("Creating users");

        _.forEach(users, (user) => {
            wait(helper.createUser(realmName, {
                enabled: true,
                attributes: user.attributes,
                username: user.name,
                emailVerified: "",
            }));
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

    const evaluate = (resourceName: string, userName: string, scopeNames: string[], status: "PERMIT" | "DENY") => {

        return run(() => {

            const resource: IResourceRepresentation = wait(helper.getResource(realmName, clientUID, resourceName));
            resource.scopes = scopeNames;

            let user: IUserRepresentation = wait(helper.getUser(realmName, userName));

            const evaluations: any = wait(helper.evaluate(realmName, clientUID, resource, (user.id as any)));

            assert.isTrue(evaluations.results.length > 0);
            _.forEach(evaluations.results, (rslt) => {
                assert.equal(rslt.status, status);
            });

        });

    };

    it("User A should be authorized to administrate library A", () => {
        return evaluate(libraryA, userA, [createScope], "PERMIT");
    });

    it("User A should be authorized to use library A", () => {
        return evaluate(libraryA, userA, [readScope], "PERMIT");
    });

    it("User A should not be authorized to administrate library B", () => {
        return evaluate(libraryB, userA, [createScope], "DENY");
    });


    it("User B should be authorized to administrate library B", () => {
        return evaluate(libraryB, userB, [createScope], "PERMIT");
    });

    it("User B should be authorized to use library B", () => {
        return evaluate(libraryB, userB, [readScope], "PERMIT");
    });

    it("User B should not be authorized to administrate library A", () => {
        return evaluate(libraryA, userB, [createScope], "DENY");
    });

});
