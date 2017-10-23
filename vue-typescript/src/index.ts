import Vue from "vue";
import { HelloWorld } from "./HelloWorld";

const hw = new HelloWorld();
hw.sayHello();

const Component = Vue.extend({
    // déduction de type activée
});