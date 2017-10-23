import Vue from "vue";
import { HelloWorld } from "./HelloWorld";

const hw = new HelloWorld();
hw.sayHello();

const app = new Vue({
    el: "#app",
    data: {
        message: "Hello Vue !",
    },
});
