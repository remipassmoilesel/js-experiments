import Vue from 'vue';
import VueRouter from 'vue-router';
import { Consumer } from './components/consumer/Consumer';
import { Enterprise } from './components/enterprise/Enterprise';
import { HelloWorldForm } from './components/hello-world/HelloWorldForm';
import './main.scss';
import { ComputedValues } from './components/computed-values/ComputedValues';
import { FunctionExample } from './components/function-example/FunctionExample';

// create and register components
const helloWorldFormComponent = new HelloWorldForm();
const enterpriseComponent = new Enterprise();
const consumerComponent = new Consumer();

const computedValues = new ComputedValues();
const functionExample = new FunctionExample();

// tag name -> component
Vue.component('hello-world', helloWorldFormComponent);
Vue.component('enterprise', enterpriseComponent);
Vue.component('consumer', consumerComponent);

// declare routes and router
const routes = [
    { path: '/enterprise', component: enterpriseComponent },
    { path: '/consumer', component: consumerComponent },
    { path: '/computed-values', component: computedValues },
    { path: '/function-example', component: functionExample },
];

// initializing router
Vue.use(VueRouter);
const router = new VueRouter({
    routes,
});

// declare vue app
let v = new Vue({
    el: '#app',
    router,
    template: require('./main.html'),
});
