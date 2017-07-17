
// source: http://chaijs.com/guide/styles/

var assert = require('chai').assert
    , expect = require('chai').expect
    , foo = 'bar'
    , beverages = {tea: ['chai', 'matcha', 'oolong']}
    , should = require('chai').should();

// with chai / assert
describe("ChaiTest", function () {
    it("Should test types, assert style", function () {
        assert.typeOf(foo, 'string'); // without optional message
        assert.typeOf(foo, 'string', 'foo is a string'); // with optional message
        assert.equal(foo, 'bar', 'foo equal `bar`');
        assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
        assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');
    });

    it("Should test types, expect style", function () {
        expect(foo).to.be.a('string');
        expect(foo).to.equal('bar');
        expect(foo).to.have.lengthOf(3);
        expect(beverages).to.have.property('tea').with.lengthOf(3);
    });

    it("Should test types, should style", function () {
        foo.should.be.a('string');
        foo.should.equal('bar');
        foo.should.have.lengthOf(3);
        beverages.should.have.property('tea').with.lengthOf(3);
    });
});
