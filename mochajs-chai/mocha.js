var assert = require('assert');

// simple mocha test
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});

var http = require('http');

describe('HTTP Get', function () {
    describe('#get()', function () {
        it('should get without error', function (done) {

            return http.get({
                    host: 'wikipedia.fr',
                    path: '/dmlsdfmlsdsmldsm'
                },
                function (response) {
                    console.log(arguments);
                    done();
                });

        });
    });
});