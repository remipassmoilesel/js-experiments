import Vue from 'vue';
import './style.scss'
import Component from "vue-class-component";
import {Machine} from "../../../../src/lib/entities/Machine";

@Component({
    props: ['machine'],
    template: require('./template.html')
})
export default class MachineSmallComponent extends Vue {

    machine: Machine;

    /**
     * Triggered when component is displayed
     */
    mounted() {
    }
}
