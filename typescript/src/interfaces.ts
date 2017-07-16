(() => {

    //
    // anonymous interface
    //

    function printLabel(labelledObj: { label: string }) {
        console.log(labelledObj.label);
    }

    let myObj = {size: 10, label: "Size 10 Object"};
    printLabel(myObj);

    //
    // declared interface
    //

    interface IPerson {
        firstName: string;
        lastName: string;
    }

    function greeter2(person: IPerson) {
        return "Hello, " + person.firstName + " " + person.lastName;
    }

    let user = {firstName: "Jane", lastName: "User"};

    document.querySelector("#out2").innerHTML = greeter2(user);

    //
    // optional properties
    //

    interface IOptionalProperties {
        color?: string;
        width?: number;
    }

    function processProperties(o: IOptionalProperties) {
        console.log(o);
    }

    processProperties({color: "red"});

    //
    // Readonly properties
    //

    interface IRoProps {
        readonly x: number;
        y: number;
    }

    function processRoProperties(o: IRoProps) {
        console.log(o);
    }

    let obj: IRoProps = {x: 4, y: 2};
    processRoProperties(obj);

    // obj.x = 5; // error
    // let foo: ReadonlyArray<number> = [1, 2, 3];

    //
    // Function interfaces
    //

    interface ISearchFunc {
        (source: string, subString: string): boolean;
    }


    let mysearch: ISearchFunc;
    // mysearch = () => { // error
    //     ...
    // };

    mysearch = (source: string, subString: string) => {
        console.log(source, subString);
        return true;
    };

    //
    // Type arrays and index
    //

    interface IStringArray {
        [index: number]: string;
    }

    let myArray: IStringArray;
    myArray = ["Bob", "Fred"];

    let myStr: string = myArray[0];

    //
    // Implementing interface
    //

    interface IClockInterface {

        // Constructor is static, and interface check is performed only on instances
        // see https://www.typescriptlang.org/docs/handbook/interfaces.html
        // new (hour: number, minute: number) : ClockInterface;

        currentTime: Date;
        setTime(d: Date): void;
    }

    class Clock implements IClockInterface {

        private currentTime: Date;

        constructor(h: number, m: number) {
            console.log("constructor: " + arguments);
        }

        public setTime(d: Date) {
            console.log("setTime: " + d);
        }

    }

    //
    // Extend interfaces
    //

    interface IShape {
        color: string;
    }

    interface ISquare extends IShape {
        sideLength: number;
    }

    interface IPenStroke {
        penWidth: number;
    }

    interface ISquare extends IShape, IPenStroke {
        sideLength: number;
    }

    let square = <ISquare> {};
    square.color = "blue";
    square.sideLength = 10;
    square.penWidth = 5.0;


    // interface extending an object
    class Control {
        private state: any;
    }

    interface ISelectableControl extends Control {
        select(): void;
    }

    //
    // Hybrid object
    // Object that act as a function and has an object
    //

    interface ICounter {
        (start: number): string;
        interval: number;
        reset(): void;
    }

    function getCounter(): ICounter {

        let counter = <ICounter> function (start: number) {
            console.log("start: " + start);
        };

        counter.interval = 123;
        counter.reset = () => {
            console.log("reset");
        };
        return counter;
    }

    let c = getCounter();
    c(10);
    c.reset();
    c.interval = 5.0;

})();
