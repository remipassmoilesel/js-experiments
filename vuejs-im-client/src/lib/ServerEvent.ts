export class ServerEvent {

    public name: string;
    public data: any;
    public date: Date;

    constructor(eventName: string, eventData: any, eventDate: Date) {
        this.name = eventName;
        this.data = eventData;
        this.date = eventDate;
    }
}