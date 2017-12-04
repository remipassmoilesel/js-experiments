import Vue from 'vue';
import './style.scss'
import Component from "vue-class-component";
import {Machine} from "../../../../src/lib/entities/Machine";
import {AnsibleConfiguration} from "../../../../src/lib/entities/Model";

@Component({
    props: ['configuration'],
    template: require('./template.html')
})
export default class AnsibleConfigDisplayComponent extends Vue {

    ansibleConfiguration: AnsibleConfiguration;

    /**
     * Triggered when component is displayed
     */
    mounted() {
    }
}
