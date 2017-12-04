import Vue from "vue";
import VueRouter from 'vue-router';
import ModelListComponent from './components/model-list/ModelListComponent';
import ModelComponent from './components/model/ModelComponent';
import MachineComponent from './components/machine/MachineComponent';
import MachineListComponent from './components/machine-list/MachineListComponent';
import ActionsComponent from './components/infra-actions/ActionsComponent';
import {SocketClient} from './lib/SocketClient';
import {Events} from '../../src/lib/common/Events';
import SummaryPanelComponent from "./components/summary-panel/SummaryPanelComponent";
import MachineSmallComponent from "./components/machine-small/MachineSmallComponent";
import LogsDisplayComponent from "./components/logs-display/LogsDisplayComponent";
import EventsDisplayComponent from "./components/events-display/EventsDisplayComponent";
import PanelPresentationComponent from "./components/panel-presentation/PanelPresentation";
import {GlobalVarStore} from "./lib/GlobalVarStore";
import {ServerEvent} from "./lib/ServerEvent";
import AnsibleConfigDisplayComponent from "./components/ansible-configuration-display/AnsibleConfigDisplayComponent";
import BotsControlComponent from "./components/load-tests-control/LoadTestControlComponent";
import DocComponent from "./components/doc-component/DocComponent";
import {Toaster} from "./components/toaster/Toaster";
import SidenavComponent from "./components/main-menu/MainMenuComponent";
import ModelManifestModalComponent from "./components/model-manifest-modal/ModelManifestModalComponent";

/**
 * Import materialize js
 */
import 'materialize-css/dist/js/materialize.min.js'
/**
 * Import main stylesheet
 */
import './main.scss';

GlobalVarStore.initialize();

/**
 * Create an event hub to forward socket.io events to
 * vue components
 */
const createEventHub = () => {

    // create an event hub
    const eventHub = new Vue();

    const client = new SocketClient();
    client.addHandler(Events.SERVER_EVENT_ID, (ev, data) => {

        console.log(`Event received: ev=${JSON.stringify(ev)} data=${JSON.stringify(data)}`);
        eventHub.$emit(Events.SERVER_EVENT_ID, ev, data);

        GlobalVarStore.getStore().serverEvents.push(new ServerEvent(ev, data, new Date()));
    });

    return eventHub;
};

const createToaster = () => {
    return new Toaster();
};

/**
 * Register components and init a new vue application
 */
const initApplication = () => {

    // register components
    Vue.component('main-menu', SidenavComponent);
    Vue.component('panel-pres', PanelPresentationComponent);

    Vue.component('model-list', ModelListComponent);
    Vue.component('model', ModelComponent);

    Vue.component('machine-list', MachineListComponent);
    Vue.component('machine', MachineComponent);
    Vue.component('machine-small', MachineSmallComponent);

    Vue.component('actions', ActionsComponent);
    Vue.component('summary-panel', SummaryPanelComponent);
    Vue.component('logs-display', LogsDisplayComponent);
    Vue.component('events-display', EventsDisplayComponent);
    Vue.component('ansible-configuration', AnsibleConfigDisplayComponent);
    Vue.component('model-manifest-modal', ModelManifestModalComponent);

    // declare routes and router
    const routes = [
        {path: '/', component: DocComponent},
        {path: '/summary-panel', component: SummaryPanelComponent},
        {path: '/models', component: ModelListComponent},
        {path: '/machines', component: MachineListComponent},
        {path: '/actions', component: ActionsComponent},
        {path: '/logs', component: LogsDisplayComponent},
        {path: '/events', component: EventsDisplayComponent},
        {path: '/load-tests', component: BotsControlComponent},
    ];

    const eventHub = createEventHub();
    const toaster = createToaster();

    // create default properties for all Vue instances
    Vue.mixin({
        data: () => {
            return {
                eventHub,
                toaster,
            };
        }
    });

    // initializing router
    Vue.use(VueRouter);
    const router = new VueRouter({
        routes,
    });

    // declare vue app
    let v = new Vue({
        el: '#app',
        router,
        template: require('./main.html'),
    });


    $(() => {
        // Initialize collapse button
        $(".button-collapse").sideNav();
        // Initialize collapsible (uncomment the line below if you use the dropdown variation)
        //$('.collapsible').collapsible();
    })

};


initApplication();


