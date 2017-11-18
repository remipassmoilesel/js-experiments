import Vue from 'vue';
import './style.scss'
import Component from "vue-class-component";
import {ApiClient} from "../../lib/ApiClient";
import {Model} from "../../../../src/lib/entities/Model";

const apiClient = new ApiClient();

@Component({
    props: ['model'],
    template: require('./template.html')
})
export default class ModelManifestModalComponent extends Vue {

    model: Model;
    modelYaml: string = 'Please wait ...';

    beforeCreate() {

    }

    /**
     * Triggered when component is displayed
     */
    mounted() {
        this.modelYaml = apiClient.getModelAsYaml(this.model);
    }
}
