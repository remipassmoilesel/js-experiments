import Vue from "vue";
import VueRouter from "vue-router";
import { Consumer } from "./components/consumer/Consumer";
import { Enterprise } from "./components/enterprise/Enterprise";
import { HelloWorldForm } from "./components/hello-world/HelloWorldForm";
import { VerticalMenu } from "./components/vertical-menu/VerticalMenu";

// create and register components
const verticalMenuComponent = new VerticalMenu();
const helloWorldFormComponent = new HelloWorldForm();
const enterpriseComponent = new Enterprise();
const consumerComponent = new Consumer();

Vue.component("vertical-menu", verticalMenuComponent);
Vue.component("hello-world", helloWorldFormComponent);

// declare routes and router
const routes = [
    { path: "/enterprise", component: enterpriseComponent },
    { path: "/consumer", component: consumerComponent },
];

// initializing router
Vue.use(VueRouter);
const router = new VueRouter({
    routes,
});

// declare vue app
let v = new Vue({
    el: "#app",
    router,
    template: require("./main.html"),
});
