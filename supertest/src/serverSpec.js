const request = require('supertest');

const app = require('./server').app;

// WARNING: we must pass an express application here, not a router !

describe('RouterSpec', () => {

    it('Get locale should work', function () {
        return request(app)
            .get('/locales')
            .set('Accept-Language', 'fr')
            .expect(200)
            .expect('Content-Type', /json/);
    });

});
