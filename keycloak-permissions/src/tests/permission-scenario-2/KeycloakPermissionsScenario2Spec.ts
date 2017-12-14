import * as chai from "chai";
import { run, wait } from "f-promise";
import * as _ from "lodash";
import "mocha";
import { IAuthSettings } from "../../lib/AuthSettings";
import { KeycloakHelper } from "../../lib/KeyloakHelper";
import { IGroupRepresentation } from "../../lib/representations/IGroupRepresentation";
import { IResourceRepresentation } from "../../lib/representations/IResourceRepresentation";
import { IUserRepresentation } from "../../lib/representations/IUserRepresentation";

const assert = chai.assert;

describe.only("Keycloak permissions scenario 2", function () {

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

    const realmName = new Date().toISOString().replace(/[-:.]+/ig, "");
    const clientName = `000-library-client-a`;
    const libraryResourceType = "library";

    const libraryA = "library-A";
    const libraryB = "library-B";
    const resources = [libraryA, libraryB];

    const userA = "userA";
    const userB = "userB";

    const groupUserPrefix = "user_";
    const groupAdminPrefix = "admin_";
    const groupLibAUser = groupUserPrefix + libraryA;
    const groupLibBUser = groupUserPrefix + libraryB;
    const groupLibAAdmin = groupAdminPrefix + libraryA;
    const groupLibBAdmin = groupAdminPrefix + libraryB;

    const groups = [groupLibAUser, groupLibAAdmin, groupLibBUser, groupLibBAdmin];

    // créer les utilisateurs
    // créer les scopes
    // créer 2 groupes par resource
    // créer 2 policies de goupe
    // créer 2 scope based permissions
    // ...

    const users = [
        {
            name: userA,
            groups: [groupLibAUser, groupLibAAdmin],
        },
        {
            name: userB,
            groups: [groupLibBUser, groupLibBAdmin],
        },
    ];

    const readScopeName = "READ";
    const editScopeName = "EDIT";
    const deleteScopeName = "DELETE";
    const updateScopeName = "UPDATE";
    const scopeNames = [deleteScopeName, readScopeName, editScopeName, updateScopeName];

    let clientUID;

    const prepareRealm = () => {

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
        const scopesRepr: any[] = [];
        _.forEach(scopeNames, (sc) => {
            scopesRepr.push(wait(helper.createScope(realmName, clientUID, sc)));
        });

        // then create groups
        console.log("Creating groups");
        _.forEach(groups, (gr) => {
            wait(helper.createGroup(realmName, gr));
        });
        const groupsRepr: IGroupRepresentation[] = wait(helper.getGroups(realmName));

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
        console.log("Creating group policies");
        _.forEach(groupsRepr, (gr) => {
            helper.createGroupBasedPolicy(realmName, clientUID,
                `Belong to ${gr.name}`, [{ id: gr.id, path: gr.path }]);
        });

        // then create permissions
        // console.log("Creating group policies");
        // _.forEach(groupsRepr, (gr) => {
        //     helper.createGroupBasedPolicy(realmName, clientUID,
        //         `Belong to ${gr.name}`, [gr]);
        // });

        //
        // const jsPolicyRepr: any = wait(helper.createJsPolicy(
        //     realmName,
        //     clientUID,
        //     jsPolicyName,
        //     jsPolicy,
        // ));

        // // then create permissions
        // console.log("Creating permission");
        //
        // wait(helper.createPermission(
        //     realmName,
        //     clientUID,
        //     {
        //         name: "Admins can administrate",
        //         type: "resource",
        //         logic: "POSITIVE",
        //         decisionStrategy: "AFFIRMATIVE",
        //         policies: [jsPolicyRepr.id],
        //         resourceType: libraryResourceType,
        //     }));
        //
        // // then create users
        // console.log("Creating users");
        //
        // _.forEach(users, (user) => {
        //     wait(helper.createUser(realmName, {
        //         enabled: true,
        //         attributes: {},
        //         username: user.name,
        //         emailVerified: "",
        //     }));
        // });
        //
        // // then map roles
        // console.log("Mapping client roles");
        //
        // _.forEach(users, (user) => {
        //     const userInfos = wait(helper.getUser(realmName, user.name));
        //     _.forEach(user.roles, (role) => {
        //         wait(helper.mapClientRoleToUser(
        //             realmName,
        //             clientUID,
        //             (userInfos.id as any),
        //             role,
        //         ));
        //     });
        // });

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
        assert.isTrue(true);
    });

    // it("User A should be authorized to use library A", () => {
    //     return evaluate(libraryA, userA, [useScopeName], "PERMIT");
    // });
    //
    // it("User A should not be authorized to administrate library B", () => {
    //     return evaluate(libraryB, userA, [adminScopeName], "DENY");
    // });
    //
    //
    // it("User B should be authorized to administrate library B", () => {
    //     return evaluate(libraryB, userB, [adminScopeName], "PERMIT");
    // });
    //
    // it("User B should be authorized to use library B", () => {
    //     return evaluate(libraryB, userB, [useScopeName], "PERMIT");
    // });
    //
    // it("User B should not be authorized to administrate library A", () => {
    //     return evaluate(libraryA, userB, [adminScopeName], "DENY");
    // });

});
