

// stringify object
console.log("Object >> string: JSON.stringify(...)");
var obj = {
    "var": "val",
    "var1": "val1",
    "var2": "val2",
};
console.log(JSON.stringify(obj));


console.log("Tester si défini sans erreurs");
console.log(typeof obj.notExisting === "undefined");

// now
console.log("Date.now()");
console.log(Date.now());

// log a function
function toLog(arg1, arg2){
    console.log(arg1, arg2);
}

console.log("toLog.toString()");
console.log(toLog.toString());

// display env vars
console.log("process.env");
console.log(process.env);
console.log("process.env.PATH");
console.log(process.env.PATH);