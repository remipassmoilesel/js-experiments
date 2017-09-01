// geospatial example

// get client
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/test", function (err, db) {

    // test if no errors
    if (!err) {
        console.log("We are connected");
    }

    var collection = db.collection('restaurants');

    // Create a geospatial index
    var createGeospatialIndex = false;
    if(createGeospatialIndex){
        collection.createIndex({'address.coord': "2dsphere"},
            function (err, result) {
                console.log("Creating geospatial index");
                console.log(result);
            });
    };

    // Find some documents
    collection.find({
        'address.coord': {
            $near: {
                $geometry: {type: "Point", coordinates: [-73.9667, 40.78]},
                $maxDistance: 1000
            }
        }
    }).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
    });


});