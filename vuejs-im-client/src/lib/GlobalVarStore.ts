import {ServerEvent} from "./ServerEvent";

export class GlobalVarStore {

    public static initialize() {
        if ((window as any).globalVarStore) {
            throw new Error("Store already exist !");
        }

        (window as any).globalVarStore = new GlobalVarStore();
    }

    public static getStore(): GlobalVarStore {
        return (window as any).globalVarStore;
    }

    public serverEvents: ServerEvent[] = [];

    constructor() {

    }

}