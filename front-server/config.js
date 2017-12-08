module.exports = [
    {
        id: 'domain1',
        hostname: 'domain1.com',
        baseDirectory: 'app1',
        templatedConfiguration: {
            apiUrl: 'http://backend.domain1.com',
            parameter1: 'value1',
        },
    },
    {
        id: 'domain2',
        hostname: 'domain2.com',
        baseDirectory: 'app2',
        templatedConfiguration: {
            apiUrl: 'http://backend.domain2.com',
            parameter1: 'value2',
        },
    },
];
