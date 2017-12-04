import Vue from 'vue';
import './style.scss';
import {ApiClient} from '../../lib/ApiClient';
import {ScaleAction} from "../../../../src/lib/entities/ScaleAction";
import Component from "vue-class-component";

const apiClient = new ApiClient();

@Component({
    template: require('./template.html')
})
export default class ActionsComponent extends Vue {

    applyInfra() {
        apiClient.applyInfra();
    }

    showDestroyInfraDialog() {
        // open modal
        $("#destroyModal").modal('open');
    }

    scaleDown() {
        apiClient.scale(ScaleAction.DOWN);
    }

    scaleUp() {
        apiClient.scale(ScaleAction.UP);
    }

    mounted() {

        // initialize destroy modal
        $("#destroyModal").modal();

        $("#btnConfirmDestroy").click(() => {
            console.log("Start destroying infra ...");
            apiClient.destroyInfra();
            $("#destroyModal").modal('close');
        });

    }
}
