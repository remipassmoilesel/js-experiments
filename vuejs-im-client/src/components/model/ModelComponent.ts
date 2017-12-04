import Vue from 'vue';
import './style.scss'
import Component from "vue-class-component";

@Component({
    props: ['model'],
    template: require('./template.html')
})
export default class ModelComponent extends Vue {

    public _uid;
    public showYamlButtonId: string;
    public yamlModalId: string;

    beforeCreate() {
        this.showYamlButtonId = `show-yaml-manifest-${this._uid}`;
        this.yamlModalId = `yaml-modal-id-${this._uid}`;
    }

    /**
     * Triggered when component is displayed
     */
    mounted() {

        $(`#${this.yamlModalId}`).modal();

        $(`#${this.showYamlButtonId}`).click(() => {
            $(`#${this.yamlModalId}`).modal('open');
        });

    }
}
