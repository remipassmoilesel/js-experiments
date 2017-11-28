"use strict";

var Db = require('tingodb')().Db,
    assert = require('assert');

var db = new Db('./geo-db', {});

var geoData = require('./stations');


// Fetch a collection to insert document into
var collection = db.createCollection('collection1');

collection.insert(geoData, function (err, result) {
    assert.equal(null, err);

    collection.find({type: 'feature'}, function (err, item) {
        assert.equal(null, err);
        console.log(item);
    });
});
