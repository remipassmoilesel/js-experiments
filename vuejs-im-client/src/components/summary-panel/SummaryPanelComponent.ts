import Vue from 'vue';
import './style.scss'
import {ApiClient} from "../../lib/ApiClient";
import {InfraState} from "../../../../src/lib/entities/InfraState";
import {Machine} from "../../../../src/lib/entities/Machine";
import {InfraConfig} from "../../../../src/lib/entities/config/InfraConfig";
import {NginxStat} from "../../../../src/lib/entities/NginxStat";
import Component from "vue-class-component";

const apiClient = new ApiClient();

@Component({
    template: require('./template.html')
})
export default class SummaryPanelComponent extends Vue {

    infraState: InfraState | null = null;
    machines: Machine[] | null = null;
    mainEntrypoint: string | null = null;
    lastNginxStats: NginxStat | null = null;
    updateInterval: NodeJS.Timer;

    /**
     * Triggered when component is displayed
     */
    mounted() {

        this.fetchInfraEntryPoint();

        this.launchInfraInterval();
    }

    fetchInfraEntryPoint() {
        apiClient.getInfraConfig().then((config: InfraConfig) => {
            this.mainEntrypoint = `http://${config.scaling.statsSource}`;
        }).catch((error: any) => {
            this.mainEntrypoint = `Error while fetching main entrypoint: ${JSON.stringify(error)}`;
        });
    }

    launchInfraInterval() {
        this.updateInterval = setInterval(() => {
            apiClient.getInfraState().then((data: InfraState) => {
                this.infraState = data;
                this.machines = data.machines;
                this.lastNginxStats = data.lastNginxLbStats;
            });
        }, 800);
    }

    beforeDestroy() {
        clearInterval(this.updateInterval);
    }
}
