// get client
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {

    // test if no errors
    if(!err) {
        console.log("We are connected");
    }

    // create a capped collection
    db.createCollection("myCollection", { "capped": true, "size": 100000, "max": 5000},
        function(err, results) {
            console.log("Collection created.");
            console.log("results");
            console.log(results);
            console.log("err");
            console.log(err);
        }
    );

    // create a validated collection
    db.createCollection("contacts",
        {
            'validator': { '$or':
                [
                    { 'phone': { '$type': "string" } },
                    { 'email': { '$regex': /@mongodb\.com$/ } },
                    { 'status': { '$in': [ "Unknown", "Incomplete" ] } }
                ]
            }
        },
        function(err, results) {
            console.log("Collection created.");
            console.log("results");
            console.log(results);
            console.log("err");
            console.log(err);
        }
    );


    // create a collection
    var collection = db.collection('test');
    var doc1 = {'hello':'doc1'};
    var doc2 = {'hello':'doc2'};
    var lotsOfDocs = [{'hello':'doc3'}, {'hello':'doc4'}];

    // insert documents
    collection.insertOne(doc1);
    collection.insertOne(doc2, {w:1}, function(err, result) {
        console.log("insertOne");
        console.log(arguments);
    });
    collection.insertMany(lotsOfDocs, {w:1}, function(err, result) {
        console.log("insertMany");
        console.log(arguments);
    });



});