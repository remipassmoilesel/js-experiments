import Vue from 'vue';
import './style.scss';
import {ApiClient} from '../../lib/ApiClient';
import * as $ from 'jquery';
import Component from "vue-class-component";

const apiClient = new ApiClient();

@Component({
    template: require('./template.html')
})
export default class LogsDisplayComponent extends Vue {

    logList: string[] = [];

    selectedLogName = '';

    selectedLogContent = '';

    logIntervalId = 0;

    selectLog(logName: string) {
        this.selectedLogName = logName;

        if (this.logIntervalId) {
            console.log(`Stopping log interval: ${this.logIntervalId}`);
            clearInterval(this.logIntervalId);
        }

        console.log(`Starting log interval: ${this.logIntervalId}`);

        // poll log every 700 ms
        this.logIntervalId = window.setInterval(() => {

            apiClient.getLog(logName).then((data) => {
                this.selectedLogContent = data;

                // scroll bottom only if mouse is not on log viewer
                const viewer: any = $('.log-viewer');
                if (!viewer.is(':hover')) {
                    viewer.scrollTop(viewer[0].scrollHeight);
                }

            }).catch((error) => {
                this.selectedLogContent = JSON.stringify(error);
            });
        }, 700);

    }

    mounted() {
        apiClient.getLogList().then((data) => {

            if (data.length > 5) {
                data.splice(5, data.length - 5);
            }
            this.logList = data;

        });
    }

    beforeDestroy(){
        clearInterval(this.logIntervalId);
    }

}
