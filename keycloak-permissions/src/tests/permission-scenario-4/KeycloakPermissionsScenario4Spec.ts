import * as chai from "chai";
import { run, wait } from "f-promise";
import * as _ from "lodash";
import "mocha";
import { IAuthSettings } from "../../lib/AuthSettings";
import { KeycloakHelper } from "../../lib/KeyloakHelper";
import { IGroupRepresentation } from "../../lib/representations/IGroupRepresentation";
import { IResourcePermissionRepresentation } from "../../lib/representations/IResourcePermissionRepresentation";
import { IResourceRepresentation } from "../../lib/representations/IResourceRepresentation";
import { IUserRepresentation } from "../../lib/representations/IUserRepresentation";

const assert = chai.assert;

describe.only("Keycloak permissions scenario 4", function () {

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

    const realmName = `Scenario-4-${new Date().toISOString().replace(/[-:.]+/ig, "")}`;
    const clientName = `000-library-client-a`;
    const libraryResourceType = "library";

    const libraryA = "library-a";
    const libraryB = "library-b";
    const resourceNames = [libraryA, libraryB];

    const userA = "user-a";
    const userB = "user-b";

    const groupDrhA = "drh-A"; // DRH: full rights
    const groupComtaA = "compta-A"; // comta: only read
    const groupDrhB = "drh-B";
    const groupComtaB = "compta-B";

    const groupNames = [groupComtaA, groupDrhA, groupComtaB, groupDrhB];

    const users = [
        {
            name: userA,
            groups: [groupComtaA, groupDrhB],
        },
        {
            name: userB,
            groups: [groupComtaB, groupDrhA],
        },
    ];

    const readScopeName = "READ";
    const editScopeName = "EDIT";
    const deleteScopeName = "DELETE";
    const updateScopeName = "UPDATE";
    const scopeNames = [deleteScopeName, readScopeName, editScopeName, updateScopeName];

    const groupScopeMappings = [
        {
            resource: libraryA,
            groupName: groupDrhA,
            scopes: scopeNames,
        },
        {
            resource: libraryA,
            groupName: groupComtaA,
            scopes: [readScopeName],
        },
        {
            resource: libraryB,
            groupName: groupDrhB,
            scopes: scopeNames,
        },
        {
            resource: libraryB,
            groupName: groupComtaB,
            scopes: [readScopeName],
        },
    ];

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
        _.forEach(groupNames, (gr) => {
            wait(helper.createGroup(realmName, gr));
        });
        const groupsRepr: IGroupRepresentation[] = wait(helper.getGroups(realmName));

        // then create group mapper
        console.log("Creating group mapper");
        // GROUP MAPPER is mandatory in order to evaluate groups membership
        // claim name value should be the same as groupClaimName from group policy
        wait(helper.createGroupMapper(realmName, clientUID, "$groups"));

        // then create resources
        console.log("Creating resources");
        _.forEach(resourceNames, (resName) => {
            wait(helper.createResource(realmName, clientUID, {
                name: resName,
                scopes: scopesRepr,
                type: libraryResourceType,
                uri: resName,
            }));
        });
        const resourcesRepr: IResourceRepresentation[] = [];
        _.forEach(resourceNames, (name) => {
            resourcesRepr.push(wait(helper.getResource(realmName, clientUID, name)));
        });

        // then create policies
        console.log("Creating group policies");
        _.forEach(groupsRepr, (gr) => {
            wait(helper.createGroupBasedPolicy(
                realmName,
                clientUID,
                `Belong to group ${gr.name}`,
                "$groups",
                [{ id: gr.id, path: gr.path }]));
        });
        const policiesRepr: IResourcePermissionRepresentation[] = wait(helper.getPolicies(
            realmName,
            clientUID,
            20,
        ));

        // then create permissions
        _.forEach(groupScopeMappings, (mapping) => {
            const resName = mapping.resource;
            const groupName = mapping.groupName;
            const scopeNames = mapping.scopes;

            const resUID = _.filter(resourcesRepr, (res) => resName === res.uri)[0]._id;
            const scopeUIDs = _.map(scopeNames, (scopeName) => {
                return _.filter(scopesRepr, (sc) => sc.name === scopeName)[0].id;
            });
            const policyUID = _.filter(policiesRepr, (pol) => {
                return pol.name.indexOf(groupName) !== -1;
            })[0].id;

            wait(helper.createScopeBasedPermission(realmName,
                clientUID,
                `Can ${scopeNames.join(", ")} on ${resName}`,
                [resUID],
                scopeUIDs,
                [policyUID]));

        });

        // then create users
        console.log("Creating users");
        const usersRepr: any[] = [];
        _.forEach(users, (user) => {
            wait(helper.createUser(realmName, {
                enabled: true,
                attributes: {},
                username: user.name,
                emailVerified: "",
            }));
            usersRepr.push(wait(helper.getUser(realmName, user.name)));
        });

        // then map groups
        console.log("Mapping groups");

        _.forEach(users, (user) => {
            _.forEach(user.groups, (groupName) => {

                const groupUID = _.filter(groupsRepr, (gr) => gr.name === groupName)[0].id;
                const userUID = _.filter(usersRepr, (userRepr) => {
                    return userRepr.username === user.name;
                })[0].id;

                wait(helper.mapGroupToUser(
                    realmName,
                    userUID,
                    groupUID,
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
                throw e;
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
                assert.equal(rslt.status, status, JSON.stringify(rslt, null, 2));
            });

        });

    };

    it("User A should be authorized to EDIT library A", () => {
        return evaluate(libraryA, userA, [editScopeName], "PERMIT");
    });

    it("User A should be authorized to READ library A", () => {
        return evaluate(libraryA, userA, [readScopeName], "PERMIT");
    });

    it("User A should not be authorized to EDIT library B", () => {
        return evaluate(libraryB, userA, [editScopeName], "DENY");
    });


    it("User B should be authorized to EDIT library B", () => {
        return evaluate(libraryB, userB, [editScopeName], "PERMIT");
    });

    it("User B should be authorized to READ library B", () => {
        return evaluate(libraryB, userB, [readScopeName], "PERMIT");
    });

    it("User B should not be authorized to EDIT library A", () => {
        return evaluate(libraryA, userB, [editScopeName], "DENY");
    });

});
