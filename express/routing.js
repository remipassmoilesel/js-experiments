var express = require('express');
var app = express();

// différentes méthodes
app.get('/', function (req, res) {
    res.send('Get request');
});
app.post('/', function (req, res) {
    res.send('Post request');
});
app.delete('/', function (req, res) {
    res.send('Delete request');
});
app.put('/', function (req, res) {
    res.send('Put request');
});


// regex sous forme de chaines
app.get('/ab?cd', function (req, res) {
    res.send('ab?cd');
});
app.get('/ab+cd', function (req, res) {
    res.send('ab+cd');
});
app.get('/ab*cd', function (req, res) {
    res.send('ab*cd');
});
app.get('/ab(cd)?e', function (req, res) {
    res.send('ab(cd)?e');
});

// regex javascript
app.get(/[0-9]{1,3}/i, function (req, res) {
    res.send("/[0-9]{1,3}/i");
});

// traiter une route avec plusieurs fonctions
app.get('/example/b',
    function (req, res, next) {
        console.log("Function A");
        next();
    }, function (req, res, next) {
        console.log("Function B");
        next();
    }, function (req, res) {
        res.send("Function C");
    });

// déclarer une écoute sur 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});