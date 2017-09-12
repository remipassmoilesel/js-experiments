#!/usr/bin/env node


/**
 * Utility used for requests
 * @param url
 * @returns {Promise}
 */
const request = function (method, req, headers) {
    return new Promise((resolve, reject) => {

        const options = {
            host: config.domain,
            port: config.port,
            path: req,
            method: method,
            headers: headers
        };

        // console.log(`Executing request: ${JSON.stringify(options)}`);

        // const request = https.request(url, (response) => {
        const request = https.request(options, (response) => {
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => {

                // handle http errors
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error(`Request failed: ${response.statusCode} body=${body}`));
                }

                resolve({
                    content: body.join(''),
                    headers: response.headers
                });
            });
        });

        // handle connection errors of the request
        request.on('error', (err) => reject(err));

        request.end();
    });
};


// get digest in order to delete image
request('HEAD', `/v2/${imageName}/manifests/${tag}`,
    {'Accept': 'application/vnd.docker.distribution.manifest.v2+json'}).then((rslt) => {

   // ...

}).catch((error) => {
    console.log(`Error while getting image hash: ${error}`);
    console.log(error.stack);
});