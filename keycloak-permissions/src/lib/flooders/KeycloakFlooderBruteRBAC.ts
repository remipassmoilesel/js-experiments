import { run, wait } from "f-promise";
import * as _ from "lodash";
import { IAuthSettings } from "../AuthSettings";
import { KeycloakHelper } from "../KeyloakHelper";

export interface IResourceToCreate {
    name: string;
    uri: string;
}

const log = (msg: string, data?: any) => {
    console.log(msg, data ? JSON.stringify(data) : "");
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

        run(() => {

            try {
                wait(this.createRealm());
                wait(this.createClient());
                wait(this.createResources());
                wait(this.createRealmRoles());
                wait(this.createClientRoles());
                wait(this.createPolicies());
                wait(this.createPermissions());
                wait(this.createUsers());
                wait(this.mapClientRoles());
                wait(this.mapRealmRoles());

                log("Flooooded !");
            } catch (e) {
                log(`Error: ${JSON.stringify(e)}`);
                process.exit(1);
            }

        });

    }

    private mapRealmRoles(): Promise<any> {

        log("Start realm roles mapping");

        const { userMappings, adminMappings } = this.prepareMappings();

        _.forEach(userMappings, (roles, user) => {
            wait(this.mapRealmRolesWithUser(user, roles));
        });

        _.forEach(adminMappings, (roles, user) => {
            wait(this.mapRealmRolesWithUser(user, roles));
        });

        return Promise.resolve();

    }

    private mapRealmRolesWithUser(userId: string, roles: string[]): Promise<any> {

        const user = wait(this.helper.getUser(this.realmName, userId));
        const userUID: string = (user.id as any);

        _.forEach(roles, (role: string) => {
            wait(this.helper.mapRealmRoleToUser(
                this.realmName,
                userUID,
                role,
            ));
        });

        return Promise.resolve();
    }

    private mapClientRoles(): Promise<any> {

        log("Start client roles mapping");

        const { userMappings, adminMappings } = this.prepareMappings();

        const clientInfos = wait(this.helper.getClient(this.realmName, this.clientName));
        const clientUID: string = clientInfos.id as any;

        _.forEach(userMappings, (roles, user) => {
            wait(this.mapClientRolesWithUser(clientUID, user, roles));
        });

        _.forEach(adminMappings, (roles, user) => {
            wait(this.mapClientRolesWithUser(clientUID, user, roles));
        });

        return Promise.resolve();

    }

    private mapClientRolesWithUser(clientUID: string, userId: string, roles: string[]): Promise<any> {

        const user = wait(this.helper.getUser(this.realmName, userId));
        const userUID: string = (user.id as any);

        _.forEach(roles, (role: string) => {

            log(`Mapping role with user: `, { role, user: userId });

            wait(this.helper.mapClientRoleToUser(
                this.realmName,
                clientUID,
                userUID,
                role,
            ));
        });

        return Promise.resolve();
    }

    private prepareMappings(): any {

        const userMappings: any = {};
        const adminMappings: any = {};

        _.forEach(this.users, (user: string) => {

            // user can use ~~ 50 lib
            userMappings[user] = [];
            _.times(50, () => {
                const sres: string = this.getAuthorizedUserRoleName(_.sample(this.resources).name);
                if (userMappings[user].indexOf(sres) === -1) {
                    userMappings[user].push(sres);
                }
            });

            // user can administrate ~~ 15 lib
            adminMappings[user] = [];
            _.times(15, () => {
                const sres: string = this.getAdminRoleName(_.sample(this.resources).name);
                if (adminMappings[user].indexOf(sres) === -1) {
                    adminMappings[user].push(sres);
                }
            });

        });

        return { userMappings, adminMappings };
    }


    private createUsers() {

        log("Start users creation");

        _.forEach(this.users, (user: string) => {

            log("Creating user: ", user);

            wait(this.helper.createUser(this.realmName, {
                enabled: true,
                attributes: {},
                username: user,
                emailVerified: "",
            }));
        });

        return Promise.resolve();
    }

    private createPermissions(): Promise<any> {

        log("Start permissions creation");

        _.forEach(this.resources, (res) => {

            log("Creating permission for: ", res);

            wait(this.helper.createPermissionFor(
                this.realmName,
                this.clientName,
                this.getAdminPermissionName(res.name),
                res.name,
                this.getAdminPolicyName(res.name),
            ));

            wait(this.helper.createPermissionFor(
                this.realmName,
                this.clientName,
                this.getAuthorizedUserPermissionName(res.name),
                res.name,
                this.getAuthorizedUserPolicyName(res.name),
            ));

        });

        return Promise.resolve();
    }

    private createPolicies(): Promise<any> {

        log("Start policies creation");

        _.forEach(this.resources, (res) => {

            log("Creating policy for: ", res);

            wait(this.helper.createPolicyFor(
                this.realmName,
                this.getAdminPolicyName(res.name),
                this.clientName,
                this.getAdminRoleName(res.name),
                this.getAdminRoleName(res.name)),
            );

            wait(this.helper.createPolicyFor(
                this.realmName,
                this.getAuthorizedUserPolicyName(res.name),
                this.clientName,
                this.getAuthorizedUserRoleName(res.name),
                this.getAuthorizedUserRoleName(res.name)),
            );

        });

        return Promise.resolve();

    }

    private createClientRoles(): Promise<any> {

        log("Start client roles creation");

        const clientInfo = wait(this.helper.getClient(this.realmName, this.clientName));
        const clientUid: string = clientInfo.id as any;

        _.forEach(this.resources, (res) => {

            log("Creating client role for: ", res);

            wait(this.helper.createClientRole(this.realmName, clientUid, {
                name: this.getAdminRoleName(res.name),
                scopeParamRequired: "",
            }));

            wait(this.helper.createClientRole(this.realmName, clientUid, {
                name: this.getAuthorizedUserRoleName(res.name),
                scopeParamRequired: "",
            }));

        });

        return Promise.resolve();
    }

    private createRealmRoles(): Promise<any> {

        log("Start realm roles creation");

        _.forEach(this.resources, (res: IResourceToCreate) => {

            log("Creating realm role for: ", res);

            wait(this.helper.createRealmRole(this.realmName, {
                name: this.getAdminRoleName(res.name),
                scopeParamRequired: "",
            }));

            wait(this.helper.createRealmRole(this.realmName, {
                name: this.getAuthorizedUserRoleName(res.name),
                scopeParamRequired: "",
            }));

        });

        return Promise.resolve();
    }

    private createResources(): Promise<any> {

        log("Start resources creation");

        const clientsInfo = wait(this.helper.getClient(this.realmName, this.clientName));
        const clientUID: string = clientsInfo.id as any;

        _.forEach(this.resources, (res: IResourceToCreate) => {

            log("Creating resource: ", res);

            wait(this.helper.createResource(this.realmName, clientUID, {
                name: res.name,
                scopes: [],
                uri: res.uri,
            }));
        });

        return Promise.resolve();

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
