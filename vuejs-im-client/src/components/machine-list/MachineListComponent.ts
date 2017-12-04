import Vue from 'vue';
import {ApiClient} from '../../lib/ApiClient';
import {Machine} from '../../../../src/lib/entities/Machine';
import Component from "vue-class-component";

const apiClient = new ApiClient();

@Component({
    template: require('./template.html')
})
export default class MachineListComponent extends Vue {

    machines: Machine[] = [];
    errorMessage: string = '';

    /**
     * Triggered when component is displayed
     */
    mounted() {
        fetchMachines().then((machines) => {
            this.machines = machines;
        });
    }
}

const fetchMachines = () => {
    const rslt = $.Deferred();

    apiClient.getMachines().then((machines) => {
        rslt.resolve(machines);
    }).catch((e) => {
        rslt.reject(e);
    });

    return rslt;
};
