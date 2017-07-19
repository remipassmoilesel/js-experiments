var express = require('express');
var app = express();

/*

 res.download()	Vous invite à télécharger un fichier.
 res.end()	Met fin au processus de réponse.
 res.json()	Envoie une réponse JSON.
 res.jsonp())	Envoie une réponse JSON avec une prise en charge JSONP.
 res.redirect()	Redirige une demande.
 res.render()	Génère un modèle de vue.
 res.send()	Envoie une réponse de divers types.
 res.sendFile	Envoie une réponse sous forme de flux d’octets.
 res.sendStatus()	Définit le code de statut de réponse et envoie sa représentation sous forme de chaîne comme corps de réponse.

 */

// télécharger un fichier
app.get("/download", function (req, res) {
    res.download("public/index.html");
});

// reponse json
app.get("/json", function (req, res) {
    res.json({"test": "ok"});
});

// redirection
app.get("/redirect", function (req, res) {
    res.redirect("/download");
});

// déclarer une écoute sur 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});