import {IAugmentedWindow} from "./IAugmentedWindow";

declare const window: IAugmentedWindow;

export class SuperHelper {

    public static getConfig(){
        return window.appConfig;
    }

}