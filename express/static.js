
var express = require('express');
var app = express();


console.log("Current directory: ");
console.log(__dirname);

// serve static files
app.use("/", express.static(__dirname + '/public'));

// ajouter d'autre répertoires au même chemin
app.use("/", express.static(__dirname + '/.'));

// déclarer une écoute sur 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});