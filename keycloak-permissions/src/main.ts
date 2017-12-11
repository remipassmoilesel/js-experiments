
import { IAuthSettings } from './lib/AuthSettings';

const keycloakBaseUrl = "http://172.17.0.3:8080/auth";
const authSettings: IAuthSettings = {
    baseUrl: keycloakBaseUrl,
    username: "keycloak",
    password: "keycloak",
    grant_type: "password",
    client_id: "admin-cli",
};