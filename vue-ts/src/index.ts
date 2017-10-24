import Vue from "vue";
import { HelloWorld } from "./components/hello-world/HelloWorld";
import { VerticalMenu } from "./components/vertical-menu/VerticalMenu";

Vue.component("vertical-menu", new VerticalMenu());
Vue.component("hello-world", new HelloWorld());

let v = new Vue({
    el: "#app",
    template: require("./main.html"),
});
