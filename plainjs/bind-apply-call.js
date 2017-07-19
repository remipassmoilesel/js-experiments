function testFunction(param1, param2) {
    console.log("this");
    console.log("params");
    console.log(param1);
    console.log(param2);
}

console.log("bind: renvoi une fonction avec un 'this' et des arguments spécifiés");
testFunction.bind("this1", "arg1", "arg2")();

console.log("call: appelle une fonction avec un 'this' et des arguments spécifiés");
testFunction.call("this1", "arg1", "arg2");

console.log("apply: appelle une fonction avec un 'this' et des arguments spécifiés sous forme de tableau");
testFunction.apply("this1", ["arg1", "arg2"]);

