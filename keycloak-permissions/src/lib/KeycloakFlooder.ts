import * as _ from "lodash";
import { IAuthSettings } from "./AuthSettings";
import { KeycloakHelper } from "./KeyloakHelper";

export interface IResourceToCreate {
    name: string;
    uri: string;
}

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

    public flood(resourceNumber: number, userNumber: number) {

        const increment = new Date().toISOString().replace(/[-:.]+/ig, "");
        this.realmName = `${increment}`;
        this.clientName = `libraries`;


        this.resources = this.prepareResources(resourceNumber);
        this.users = this.prepareUsers(userNumber);

        this.createRealm()
            .then(this.createClient.bind(this))
            .then(this.createResources.bind(this))
            .then(this.createRealmRoles.bind(this))
            .then(this.createClientRoles.bind(this));


    }

    private createClientRoles() {
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
        const promises: Array<Promise<any>> = [];

        _.forEach(this.resources, (res: IResourceToCreate) => {

            promises.push(this.helper.createRealmRole(this.realmName, {
                name: this.getAdminRoleName(res.name),
                scopeParamRequired: "",
            }));

            promises.push(this.helper.createRealmRole(this.realmName, {
                name: this.getAuthorizedUserRoleName(res),
                scopeParamRequired: "",
            }));

        });

        return Promise.all(promises);
    }

    private createResources() {

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
