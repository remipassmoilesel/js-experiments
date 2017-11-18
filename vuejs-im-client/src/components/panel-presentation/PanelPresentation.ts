import Vue from 'vue';
import './style.scss'
import Component from "vue-class-component";

@Component({
    template: require('./template.html')
})
export default class PanelPresentationComponent extends Vue {

    /**
     * Triggered when component is displayed
     */
    mounted() {

    }
}
