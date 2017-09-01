
var express = require('express');
var session = require('express-session');
var Keycloak = require('keycloak-connect');

var memoryStore = new session.MemoryStore();

let kconfig = {
    clientId: 'myclient',
    bearerOnly: true,
    serverUrl: 'http://localhost:8080/auth',
    realm: 'myrealm',
    realmPublicKey: 'MIIBIjANB...'
};

var keycloak = new Keycloak({ store: memoryStore }, kconfig);


var app = express();

app.use( keycloak.middleware() );