import * as io from 'socket.io-client';

const log = (msg: any) => {
    const toLog = msg ? `[${new Date()}] ${msg}` : '';
    console.log(toLog);
};

export class SocketClient {
    private socket: any;

    constructor() {
        this.socket = io.connect();
        log(`Socket connection initialized`)
    }

    public addHandler(ev: string, callback: (ev: string, data: any) => void) {
        this.socket.on(ev, (ev: string, data: any) => {
            log(`Message received from server: event=${ev} data=${JSON.stringify(data)}`);
            callback(ev, data);
        });
    }
}