import * as request from 'request-promise';
import { AuthSettings } from '../lib/AuthSettings';
import { ResourceRepresentation } from '../lib/ResourceRepresentation';
import { ClientRepresentation } from '../lib/ClientRepresentation';

export class Helper {

    public getToken(settings: AuthSettings) {

        const options = {
            method: 'POST',
            uri: `${settings.baseUrl}/realms/master/protocol/openid-connect/token`,
            form: settings,
            json: true
        };

        return request(options).then((data) => {
            return data.access_token;
        });
    }

    public getAuth(settings: AuthSettings) {
        return this.getToken(settings).then((accessToken) => {
            // console.log(arguments);
            return {
                bearer: accessToken
            };
        });
    }

    public getRealms(settings: AuthSettings) {
        return this.getAuth(settings).then((auth) => {
            const options = {
                uri: `${settings.baseUrl}/admin/realms`,
                auth: auth,
                json: true
            };
            return request(options);
        });
    }

    public getClients(authSettings: AuthSettings, realmName: string): Promise<ClientRepresentation[]> {
        return this.getAuth(authSettings)
            .then((auth) => {
                const options = {
                    method: 'GET',
                    uri: `${authSettings.baseUrl}/admin/realms/${realmName}/clients`,
                    auth: auth,
                    json: true
                };

                return request(options);
            });
    }

    public createResource(authSettings: AuthSettings, payload: ResourceRepresentation) {

        return this.getAuth(authSettings).then((auth) => {

            const options = {
                method: 'POST',
                uri: authSettings.baseUrl,
                auth: auth,
                body: payload,
                json: true
            };

            console.log(options);

            return request(options);
        });

    }

    // TODO: finalize
    public evaluate(settings: AuthSettings, payload) {

        return this.getAuth(settings).then((auth) => {

            const options = {
                method: 'POST',
                uri: `${settings.baseUrl}/admin/realms/library-poc/clients/e47e0f0d-2932-4d7f-8533-1f7eac9305cf/authz/resource-server/policy/evaluate`,
                auth: auth,
                body: payload,
                json: true
            };

            console.log(options);

            return request(options);
        });

    }
}