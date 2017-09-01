var _ = require('lodash');
var sleep = require('sleep');

//
// remplacer 'for'
_.times(5, function (i) {
    console.log("Loop " + i + " times");
});

//
// obtenir le non du premier animal de chaucun
var ownerArr = [{
    "owner": "Colin",
    "pets": [{"name": "dog1"}, {"name": "dog2"}]
}, {
    "owner": "John",
    "pets": [{"name": "dog3"}, {"name": "dog4"}]
}];

var pets0 = _.map(ownerArr, 'pets[0].name');
console.log("pets0");
console.log(pets0);


// trouver dans un tableau
var users = [
    { firstName: "John", lastName: "Doe", age: 28, gender: "male" },
    { firstName: "Jane", lastName: "Doe", age: 5, gender: "female" },
    { firstName: "Jim", lastName: "Carrey", age: 54, gender: "male" },
    { firstName: "Kate", lastName: "Winslet", age: 40, gender: "female" }
];

console.log("users");
console.log(users);

var user = _.find(users, { lastName: "Doe", gender: "male" });

console.log("user");
console.log(user);

var underAgeUser = _.find(users, function(user) {
    return user.age < 18;
});

console.log("underAgeUser");
console.log(underAgeUser);

// créer une collections avec des clefs modifiées:
var array = [
    { 'dir': 'left', 'code': 97 },
    { 'dir': 'right', 'code': 100 }
];

console.log("_.keyBy(array, 'dir')");
console.log(_.keyBy(array, 'dir'));
console.log(_.keyBy(array, 'dir')['left']);
// => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }

// reduire une collection
var rslt = _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
    (result[value] || (result[value] = [])).push(key);
    return result;
}, {});

console.log("_.reduce(...");
console.log(rslt);

// enlever les doublons
var sortedArray = [1, 1, 2, 3, 3, 3, 5, 8, 8];
console.log("_.sortedUniq(sortedArray)");
console.log(_.sortedUniq(sortedArray));