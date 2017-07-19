

console.log("Object >> string: JSON.stringify(...)");
var obj = {
    "var": "val",
    "var1": "val1",
    "var2": "val2",
};
console.log(JSON.stringify(obj));

console.log("Tester si défini sans erreurs");
console.log(typeof obj.notExisting === "undefined");

