
// Comment utiliser instanceof avec un nom d'interface ? Impossible.

interface IMessage {
    content: string;
}

function instanceOfIMessage(object: any): object is IMessage {
    try{
        return 'content' in object;
    }catch (e) {
        return false;
    }

}

class Message implements IMessage {
    private content: string;

    constructor(content: string) {
        this.content = content;
    }
}


function returnPromiseOrType(promise: boolean, resultCorrect: boolean) {

    let result: any = new Message('Content');
    if(!resultCorrect){
        result = 'hey hey';
    }

    if (promise) {
        return Promise.resolve(result);
    } else {
        return result;
    }
}

let result: Message | Promise<Message> = returnPromiseOrType(true, false);

console.log(result);
// console.log(result instanceof IMessage); // impossible
console.log(result instanceof Message); // false
console.log(instanceOfIMessage(result)); // false

console.log("instanceOfIMessage(returnPromiseOrType(false, false))");
console.log(instanceOfIMessage(returnPromiseOrType(false, false)));

console.log("instanceOfIMessage(returnPromiseOrType(false, true))");
console.log(instanceOfIMessage(returnPromiseOrType(false, true)));
