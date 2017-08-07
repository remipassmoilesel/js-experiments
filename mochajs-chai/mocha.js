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

// running only one test: describe.only
describe.only('RemoteServiceSyncTest', function () {
    it('BeeCommA should receive message from BeeCommB', (done) => {
        // ...
    });
});

// npm task example
var packageDotJson = {
    "test": "npm run clean-compile && ./node_modules/mocha/bin/_mocha --full-trace --recursive --require source-map-support/register 'build/test/**/*Spec.js'"
};

// asynchronous test with promises
describe('bla bla', () => {
    it('bla bla', (done) => {
        // -> as done is specified, we must call it in every case

        bcB.act(subject, message)
            .then((msg) => {
                assert.deepEqual(message, msg);
                done(); // test ok
            })
            .catch((e) => {
                done(e); // test error
            });
    });

});

// asynchronous test with f-promises
describe('bla bla', () => {
    it('bla bla', () => {
        // -> done is not specified

        try {
            wait(bcB.act(subject, message));
        } catch (e) {
            throw e;
        }

    });

});

// assert throw an exception
assert.throw(function () {
    throw new Error("message");
}, "message");

