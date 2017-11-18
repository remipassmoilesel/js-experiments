import Vue from 'vue';
import Component from "vue-class-component";
import './style.scss'

@Component({
    props: ['content'],
    template: require('./template.html')
})
export default class CellComponent extends Vue {

    /**
     * Triggered when component is displayed
     */
    mounted() {

    }
}
