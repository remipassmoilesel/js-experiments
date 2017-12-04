import './style.scss';

export class ToastType {
    public className: string;
    public textColor: string;
    public icon: string;

    constructor(className: string, icon: string) {
        this.className = className;
        this.icon = icon;
    }
}

export class Toaster {

    public static ERROR = new ToastType("errorToast", "fa-warning");
    public static INFO = new ToastType("infoToast", "fa-info");

    private toastBody: any;

    constructor() {
        this.toastBody = $(require('./template.html'));
    }

    public error(message: string) {
        this.show(message, Toaster.ERROR);
    }

    public info(message: string) {
        this.show(message, Toaster.INFO);
    }

    public show(message: string, type?: ToastType, duration?: number) {

        const newContent = this.toastBody.clone();
        newContent.find(".toastMessage").html(message);

        const toastType = type || Toaster.INFO;
        const toastDuration = duration || 4000;

        newContent.find('.icon').addClass(toastType.icon);

        Materialize.toast(newContent, toastDuration, toastType.className);
    }

    public dismissAll() {
        Materialize.Toast.removeAll();
    }

}