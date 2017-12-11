import * as request from 'request-promise';

export class Helper {

    public getToken(settings) {

        const options = {
            method: 'POST',
            uri: settings.baseUrl + settings.openidConnectPath,
            form: settings,
            json: true
        };

        return request(options).then((data) => {
            return data.access_token;
        });
    }

    public getAuth(settings) {
        return this.getToken(settings).then((accessToken) => {
            // console.log(arguments);
            return {
                bearer: accessToken
            };
        });
    }

    public getRealms(settings) {
        return this.getAuth(settings).then((auth) => {
            const options = {
                uri: `${settings.baseUrl}/admin/realms`,
                auth: auth,
                json: true
            };
            return request(options);
        });
    }

    public evaluate(settings, payload) {

        return this.getAuth(settings).then((auth) => {

            const options = {
                method: 'POST',
                uri: settings.baseUrl + settings.evaluatePath,
                auth: auth,
                body: payload,
                json: true
            };

            console.log(options);

            return request(options);
        });

    }

}