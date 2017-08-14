//
// CLASSES
//

class ClassExample {

    // default is public
    // greeting: string;
    public greeting: string;

    // readonly values
    public readonly readonlyValue: number = 5;

    constructor(message: string) {
        this.greeting = message;
    }

    // use default value
    public move(distanceInMeters: number = 0) {
        console.log('`${distanceInMeters}`');
        console.log(`${distanceInMeters}`);
    }

    public greet() {
        return 'Hello, ' + this.greeting;
    }
}

let greeter = new ClassExample('world');

// use of default value
greeter.move();
greeter.move(5);


//
// SETTERS AND GETTERS
//

let passcode = 'secret passcode';

class Employee {

    private _fullName: string;

    get fullName(): string {
        return this._fullName + ' ho ho !';
    }

    set fullName(newName: string) {
        console.log('Fullname setted: ' + newName);
        this._fullName = newName + ' hey hey !';
    }
}

let employee = new Employee();
employee.fullName = 'Bob Smith';

console.log(employee.fullName);

//
// Abstract classes
//

abstract class Animal {
    abstract makeSound(): void;

    public move(): void {
        console.log('roaming the earth...');
    }
}

class Goat extends Animal {
    private makeSound(): void {
        console.log('Béééééé');
    }
}
