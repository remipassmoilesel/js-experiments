import { IAuthSettings } from "./lib/AuthSettings";
import { KeycloakFlooder } from "./lib/flooders/KeycloakFlooderBruteRBAC";

const keycloakBaseUrl = "http://172.17.0.3:8080/auth";
const authSettings: IAuthSettings = {
    baseUrl: keycloakBaseUrl,
    username: "keycloak",
    password: "keycloak",
    grant_type: "password",
    client_id: "admin-cli",
};

console.log(`Starting: ${new Date()}`);

const increment = new Date().toISOString().replace(/[-:.]+/ig, "");
const realmName = `${increment}`;
const clientName = `libraries`;

const kf = new KeycloakFlooder(authSettings);
kf.flood(realmName, clientName, 10, 20);

console.log(`Finishing: ${new Date()}`);
