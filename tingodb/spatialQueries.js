"use strict";

// see https://docs.mongodb.com/manual/tutorial/geospatial-tutorial/

var Db = require('tingodb')().Db,
    assert = require('assert');

var db = new Db('./geo-db', {});

var geoData = require('./stations');

var collection = db.createCollection('collection1');

collection.insert(geoData, function (err, result) {
    assert.equal(null, err);


});
