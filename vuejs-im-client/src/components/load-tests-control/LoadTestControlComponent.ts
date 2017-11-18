import Vue from 'vue';
import './style.scss';
import {ApiClient} from '../../lib/ApiClient';
import Component from "vue-class-component";
import {LoadTestScenario} from "../../../../src/lib/entities/LoadTestingScenario";
import {Toaster} from "../toaster/Toaster";

const apiClient = new ApiClient();

@Component({
    template: require('./template.html')
})
export default class LoadTestControlComponent extends Vue {

    toaster: Toaster;
    scenaries = LoadTestScenario.PUBLIC_SCENARIES;
    selectedScenario: LoadTestScenario = this.scenaries[0];

    startLoadTest() {
        apiClient.startLoadTests(this.getCurrentScenario())
            .then(() => {
                this.toaster.info("Scenario launched");
            })
            .catch(() => {
                this.toaster.error("Error while launching scenario");
            });
    }

    stopLoadTest() {
        apiClient.stopLoadTests();
    }

    updateSelectedValue() {

    }

    mounted() {
        $(() => {
            $('#selectScenario').material_select();
            $('#selectScenario').on('change', () => {
                this.selectedScenario = this.getCurrentScenario();
            });
        });
    }

    getCurrentScenario(): LoadTestScenario {
        return LoadTestScenario.getById(Number($('#selectScenario').val()));
    }

}
