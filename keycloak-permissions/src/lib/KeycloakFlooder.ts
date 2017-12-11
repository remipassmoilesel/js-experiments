import * as _ from "lodash";
import { IAuthSettings } from "./AuthSettings";
import { KeycloakHelper } from "./KeyloakHelper";

export interface IResourceToCreate {
    name: string;
    uri: string;
}

const log = (msg) => {
    console.log(msg);
};

export class KeycloakFlooder {
    private helper: KeycloakHelper;
    private adminRoleName = "admin";
    private authorizedUserRoleName = "authorized_user";
    private realmName: string;
    private clientName: string;
    private resources: IResourceToCreate[];
    private users: string[];

    constructor(authSettings: IAuthSettings) {
        this.helper = new KeycloakHelper(authSettings);
    }

    public flood(realmName: string, clientName: string, resourceNumber: number, userNumber: number) {

        this.realmName = realmName;
        this.clientName = clientName;

        this.resources = this.prepareResources(resourceNumber);
        this.users = this.prepareUsers(userNumber);

        this.createRealm()
            .then(this.createClient.bind(this))
            .then(this.createResources.bind(this))
            .then(this.createRealmRoles.bind(this))
            .then(this.createClientRoles.bind(this))
            .then(this.createPolicies.bind(this))
            .then(this.createPermissions.bind(this))
            .then(this.createUsers.bind(this))
            .then(() => {
                log("Flooooded !");
            })
            .catch((e) => {
                log(`Error: ${JSON.stringify(e)}`);
                process.exit(1);
            });

    }

    private createUsers() {

        log("Start users creation");

        const promises: Array<Promise<any>> = [];

        _.forEach(this.users, (user: string) => {
            promises.push(this.helper.createUser(this.realmName, {
                enabled: true,
                attributes: {},
                username: user,
                emailVerified: "",
            }));
        });

        return Promise.all(promises);
    }

    private createPermissions() {

        log("Start permissions creation");

        const promises: Array<Promise<any>> = [];
        _.forEach(this.resources, (res) => {
            promises.push(this.helper.createPermissionFor(
                this.realmName,
                this.clientName,
                this.getAdminPermissionName(res.name),
                res.name,
                this.getAdminPolicyName(res.name),
            ));

            promises.push(this.helper.createPermissionFor(
                this.realmName,
                this.clientName,
                this.getAuthorizedUserPermissionName(res.name),
                res.name,
                this.getAuthorizedUserPolicyName(res.name),
            ));

        });

        return Promise.all(promises);
    }

    private createPolicies() {

        log("Start policies creation");

        const promises: Array<Promise<any>> = [];
        _.forEach(this.resources, (res) => {

            promises.push(this.helper.createPolicyFor(
                this.realmName,
                this.getAdminPolicyName(res.name),
                this.clientName,
                this.getAdminRoleName(res.name),
                this.getAdminRoleName(res.name)),
            );

            promises.push(this.helper.createPolicyFor(
                this.realmName,
                this.getAuthorizedUserPolicyName(res.name),
                this.clientName,
                this.getAuthorizedUserRoleName(res.name),
                this.getAuthorizedUserRoleName(res.name)),
            );

        });

        return Promise.all(promises);

    }

    private createClientRoles() {

        log("Start client roles creation");

        return this.helper.getClient(this.realmName, this.clientName)
            .then((clientInfo) => {

                const clientUid: string = clientInfo.id as any;
                const promises: Array<Promise<any>> = [];

                _.forEach(this.resources, (res) => {

                    promises.push(this.helper.createClientRole(this.realmName, clientUid, {
                        name: this.getAdminRoleName(res.name),
                        scopeParamRequired: "",
                    }));

                    promises.push(this.helper.createClientRole(this.realmName, clientUid, {
                        name: this.getAuthorizedUserRoleName(res.name),
                        scopeParamRequired: "",
                    }));

                });

                return Promise.all(promises);
            });
    }

    private createRealmRoles() {

        log("Start realm roles creation");

        const promises: Array<Promise<any>> = [];

        _.forEach(this.resources, (res: IResourceToCreate) => {

            promises.push(this.helper.createRealmRole(this.realmName, {
                name: this.getAdminRoleName(res.name),
                scopeParamRequired: "",
            }));

            promises.push(this.helper.createRealmRole(this.realmName, {
                name: this.getAuthorizedUserRoleName(res.name),
                scopeParamRequired: "",
            }));

        });

        return Promise.all(promises);
    }

    private createResources() {

        log("Start resources creation");

        return this.helper.getClient(this.realmName, this.clientName).then((clientsInfo) => {
            const clientUID: string = clientsInfo.id as any;

            const promises = _.forEach(this.resources, (res: IResourceToCreate) => {
                return this.helper.createResource(this.realmName, clientUID, {
                    name: res.name,
                    scopes: [],
                    uri: res.uri,
                });
            });

            return Promise.all(promises);
        });
    }

    private createClient() {

        log("Start client creation");

        return this.helper.createClient(this.realmName, {
            clientId: this.clientName,
            name: this.clientName,
            description: `Description of ${this.clientName}`,
            redirectUris: ["http://localhost"],
            serviceAccountsEnabled: true,
            authorizationServicesEnabled: true,
        });
    }

    private createRealm() {

        log("Start realm creation");

        return this.helper.createRealm(this.realmName);
    }

    private prepareUsers(userNumber: number): string[] {
        const users: string[] = [];
        _.times(userNumber, (i) => {
            users.push(`user_${i}`);
        });
        return users;
    }

    private prepareResources(resourceNumber: number): IResourceToCreate[] {
        const resources: IResourceToCreate[] = [];
        _.times(resourceNumber, (i) => {
            const resName = `resource_${i}`;
            resources.push({
                name: resName,
                uri: this.getResourceUri(`resource_${i}`),
            });
        });
        return resources;
    }

    private getResourceUri(resourceName) {
        return `uri:id:${resourceName}`;
    }


    private getAdminRoleName(resourceName) {
        return `${this.adminRoleName}-${resourceName}`;
    }

    private getAuthorizedUserRoleName(resourceName) {
        return `${this.authorizedUserRoleName}-${resourceName}`;
    }

    private getAdminPolicyName(resourceName) {
        return `Admins can administrate ${resourceName}`;
    }

    private getAuthorizedUserPolicyName(resourceName) {
        return `Users can use ${resourceName}`;
    }

    private getAdminPermissionName(resourceName) {
        return `Permission - Admins can administrate ${resourceName}`;
    }

    private getAuthorizedUserPermissionName(resourceName) {
        return `Permission - Users can use ${resourceName}`;
    }

}
