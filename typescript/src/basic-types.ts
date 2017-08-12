(() => {

    //
    // BASICS
    //

    let isDone: boolean = false;

    let decimal: number = 6;
    let hex: number = 0xf00d;
    let binary: number = 0b1010;
    let octal: number = 0o744;

    let color: string = "blue";
    // color = 'red';

    //
    // STRINGS
    //

    // template strings, multiline
    let fullName: string = `Bob Bobbington`;
    let age: number = 37;
    let sentence: string = `Hello, my name is ${ fullName }.

    I'll be ${ age + 1 } years old next month.`;

    //
    // TUPLES
    //

    // Declare a tuple type
    let tupleX: [string, number];
    // Initialize it
    tupleX = ["hello", 10]; // OK
    // Initialize it incorrectly
    // tupleX = [10, "hello"]; // Error

    console.log("tupleX[0].substr(1)");
    console.log(tupleX[0].substr(1)); // OK
    // console.log(tupleX[1].substr(1)); // Error

    // extend a tuple
    tupleX[5] = "Hey ";


    //
    // ENUMS
    //

    enum Color {Red, Green, Blue}
    let c1: Color = Color.Green;

    console.log("Color.Red === 0");
    console.log(Color.Red === 0);

    // change values, count start at 1 instead of zero
    enum Color1 {Red = 1, Green, Blue}

    console.log("Color1.Green === 2");
    console.log(Color1.Green === 2);

    // set values manually
    enum Color2 {Red = 1, Green = 2, Blue = 4}

    console.log("Color2.Blue === 4");
    console.log(Color2.Blue === 4);

    enum Color3 {Red = 1, Green, Blue}
    let colorName: string = Color3[2];

    console.log("colorName");
    console.log(colorName);

    //
    // ANY
    //

    // When we are not sure of the type. The type will be determined at the first affectation.

    let notSure: any = 4;
    notSure = "maybe a string instead";
    notSure = false; // okay, definitely a boolean

    let anyList: any[] = [1, true, "free"];
    anyList[1] = 100;

    //
    // VOID, UNDEFINED, NULL, NEVER
    //

    // usefull only on method

    function warnUser(): void {
        alert("This is my warning message");
    }

    // vars can only be undefined or null

    let unusable: void = undefined;
    unusable = null;
    // unusable = 1; // error

    let undefinedVar: undefined = undefined;
    let nullVar: null = null;

    // Functions returning never must have unreachable end point
    function error(message: string): never {
        throw new Error(message);
    }

    //
    // TYPE ASSERTION
    //

    // look like a cast

    let someValue: any = "this is a string";
    let strLength: number = (<string> someValue).length;
    strLength = (someValue as string).length;

    // TYPER LE RETOUR D4UNE FONCTION
    const doSomething = () : any => {
        return null;
    };

    let someVar = doSomething<string>()
	    console.log(someVar);

    // Typer une callback (types arguments) => type de retour
    let callback: (arg1: string, arg2: number) => number;
})();
