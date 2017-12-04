import Vue from 'vue';
import { ApiClient } from '../../lib/ApiClient';
import { Model } from '../../../../src/lib/entities/Model';
import Component from "vue-class-component";

const apiClient = new ApiClient();

@Component({
    template: require('./template.html')
})
export default class ModelListComponent extends Vue {

    models: Model[] = [];
    errorMessage: string = '';

    /**
     * Triggered when component is displayed
     */
    mounted() {
        fetchModels().then((models) => {
            this.models = models;
        });
    }
}

const fetchModels = () => {
    const rslt = $.Deferred();

    apiClient.getModels().then((models) => {
        rslt.resolve(models);
    }).catch((e) => {
        rslt.reject(e);
    });

    return rslt;
};
