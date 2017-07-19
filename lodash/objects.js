var _ = require('lodash');
var sleep = require('sleep');

//
// cloner des objets
var objA = {
    "var": "val"
};

var objB = _.cloneDeep(objA);
console.log("objB === objA");
console.log(objB === objA);

// étendre des objets: ajouter au premier arguments les propriétés des autres objet
// modifie l'objet
var objA = {"name": "colin", "car": "suzuki"};
var objB = {"name": "james", "age": 17};
var objC = {"pet": "dog"};

console.log("_.assign(objA, objB, objC)");
_.assign(objA, objB, objC);
console.log(objA);

// enlever un membre
var objD = _.omit(objA, ['car', 'age']);
console.log("objD");
console.log(objD);

// enlever un membre à l'aide d'une fonction
var objE = _.omitBy(objA, _.isNumber);
console.log("objE");
console.log(objE);

// composer un objet à partir des propriétés d'un autre objet
var objF = _.pick(objA, ['car', 'age']);
console.log("objF");
console.log(objF);

// affecter une valeur avec un chemin
var bar = { foo: { key: "foo" } };
_.set(bar, "foo.items[0]", "An item");
console.log("bar");
console.log(bar);

var name = _.get(bar, "name", "John Doe");
console.log("name");
console.log(name);
