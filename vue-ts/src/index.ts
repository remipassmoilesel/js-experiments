import Vue from 'vue';
import { VerticalMenu } from './components/vertical-menu/VerticalMenu';

Vue.component('vertical-menu', new VerticalMenu());

let v = new Vue({
    el: '#app',
    template: `
    <div>
        <vertical-menu></vertical-menu>
        <div>Hello {{name}}!</div>
        Name: <input v-model="name" type="text">
    </div>`,
    data: {
        name: 'World',
    },
});
