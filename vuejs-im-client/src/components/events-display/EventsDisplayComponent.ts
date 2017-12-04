import Vue from 'vue';
import './style.scss';
import {ServerEvent} from "../../lib/ServerEvent";
import Component from "vue-class-component";
import {GlobalVarStore} from "../../lib/GlobalVarStore";

const debug = false;

@Component({
    template: require('./template.html')
})
export default class EventsDisplayComponent extends Vue {

    eventsList: ServerEvent[] = GlobalVarStore.getStore().serverEvents;
    private eventInterval: NodeJS.Timer;

    created() {
        if (debug) {
            this.eventInterval = setInterval(() => {
                GlobalVarStore.getStore().serverEvents.push(new ServerEvent('event 1', {hey: "ho"}, new Date()));
            }, 800)
        }
    }

    beforeDestroy(){
        clearInterval(this.eventInterval);
    }

}
