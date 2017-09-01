class Student {
    private fullName: string;

    // Here 'public' keywords create implicitly properties
    // so student is compatible with interface Person below
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = firstName + ' ' + middleInitial + ' ' + lastName;
    }

}

interface IPerson {
    firstName: string;
    lastName: string;
}

function greeter1(person: IPerson) {
    return 'Hello, ' + person.firstName + ' ' + person.lastName;
}

let classUser = new Student('Jane', 'M.', 'User');

// Forbidden
// console.log(classUser.fullName);

document.querySelector('#out1').innerHTML = greeter1(classUser);
