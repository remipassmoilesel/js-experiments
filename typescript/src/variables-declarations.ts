(() => {

    // More at : https://www.typescriptlang.org/docs/handbook/variable-declarations.html

    //
    // LET
    //

    // let define block scoped vars

    function f(input: boolean) {
        let a = 100;

        if (input) {
            // Still okay to reference 'a'
            let b = a + 1;
            return b;
        }

        // Error: 'b' doesn't exist here
        // return b;
    }

    //
    // CONST
    //

    // Same as let but forbid reassignation

    const numLivesForCat = 9;
    const kitty = {
        name: "Aurora",
        numLives: numLivesForCat,
    };

    // Error
    // kitty = {
    //     name: "Danielle",
    //     numLives: numLivesForCat
    // };

    // all "okay"
    kitty.name = "Rory";
    kitty.name = "Kitty";
    kitty.name = "Cat";
    kitty.numLives--;


    //
    // Destructuring arrays and objects
    // MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    //

    let a;
    let b;
    let rest;
    [a, b] = [10, 20];
    console.log("a");
    console.log(a); // 10
    console.log("b"); // 20
    console.log(b); // 20

    [a, b, ...rest] = [10, 20, 30, 40, 50];
    console.log("a");
    console.log(a); // 10
    console.log("b");
    console.log(b); // 20
    console.log(rest); // [30, 40, 50]

    ({a, b} = {a: 10, b: 20});
    console.log(a); // 10
    console.log(b); // 20

    // swap variables
    let first = "first";
    let second = "second";
    [first, second] = [second, first];

    console.log("first");
    console.log(first);
    console.log("second");
    console.log(second);

    function f2([first, second]: [number, number]) {
        console.log("first");
        console.log(first);
        console.log("second");
        console.log(second);
    }

    f2([1, 2]);

    // ignore elements while destructuring
    let [firstB] = [1, 2, 3, 4];
    console.log("first");
    console.log(firstB); // outputs 1

    let [, secondB, , fourth] = [1, 2, 3, 4];
    console.log("fourth");
    console.log(fourth); // outputs 4

    // destructure objects
    let o = {
        aa: "foo",
        bb: 12,
        cc: "bar",
    };

    // renaming properties: value of aa will be in newAa, etc ...
    let {aa: newAa, bb: newBb} = o;
    console.log("aa");
    console.log(newAa);
    console.log("bb");
    console.log(newBb);

    // create a variable to store skipped objects
    let {aa: newAaa, ...passthrough} = o;
    let total = passthrough.bb + passthrough.cc.length;

    console.log("newAaa");
    console.log(newAaa);

    console.log("total");
    console.log(total);

    console.log("passthrough");
    console.log(passthrough);

})();


