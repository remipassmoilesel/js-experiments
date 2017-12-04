import Vue from 'vue';
import './style.scss';
import Component from "vue-class-component";

@Component({
    template: require('./template.html')
})
export default class MainMenuComponent extends Vue {

    mounted() {
        $(() => {

            // init sidenav
            const sidenav = $('.sidenav');
            sidenav.sideNav();

            // add weave effect to all links
            $('#sidenav-slide-out li a').addClass('waves-effect');

            // close sidenav on click
            $('#sidenav-slide-out li a').click(()=>{
                sidenav.sideNav('hide');
            });
        });
    }

}
