var _ = require('lodash');
var sleep = require('sleep');

//
// générer un id unique
console.log("_.uniqueId()");
console.log(_.uniqueId());
console.log(_.uniqueId("prefix"));

//
// remplir un tableau avec id unique
var populatedArray = _.times(6, _.uniqueId.bind(null, 'prefix_'));

console.log("populatedArray");
console.log(populatedArray);

// Nombres aléatoires
console.log("_.random(15, 20)");
console.log(_.random(15, 20));
console.log(_.random(15, 20, true)); // floating

// tester des types
console.log("Types tests");
console.log(_.isString("hey"));
console.log(_.isNumber(123));
console.log(_.isArray([1,2]));

function testArguments(){
    console.log(_.isArguments(arguments));
    console.log(_.isArguments([0,1]));
}

testArguments();

// select random
var luckyDraw = ["Colin", "John", "James", "Lily", "Mary"];
console.log("_.sample(luckyDraw)");
console.log(_.sample(luckyDraw));

// gestion des erreurs sans try catch
var strInvalid = 'a';
var strValid = '{"a":"b"}';

console.log("Try to parse a valid object, return response");
var response = _.attempt(JSON.parse.bind(null, strValid));
console.log(response);

console.log("Try to parse an invalid object, return error");
response = _.attempt(JSON.parse.bind(null, strInvalid));
console.log(response);

// appeler une fonction 500 ms après le dernier appel de cette fonction
function printTime(prefix){
    console.log(prefix + " " + new Date().getTime())
}

_.times(5, function(i){
    printTime("debounce call " + i);
    _.debounce(printTime.bind(null, "final call ", 500))();
    sleep.msleep(400);
});

// retirer les caractères à probleme
console.log(_.deburr("déjà vu"));
console.log(_.deburr("Juan José"));













