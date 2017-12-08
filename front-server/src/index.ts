import * as path from 'path';
import { TemplateServer } from './templater/TemplateServer';
import { NginxConfigurator } from './nginx/NginxConfigurator';
import { IFrontApplicationConfig } from './templater/IFrontApplicationConfig';
import { log } from './utils';

const projectRoot = path.resolve(__dirname, '..');
export const appConfigurations: IFrontApplicationConfig[] = require(path.resolve(projectRoot, 'config'));

log();
log(`Initialized with configuration: ${JSON.stringify(appConfigurations, null, 2)}`);
log();

const configureNginxAndLoadTemplater = () => {

    const nginxConfigurationPath = '/etc/nginx/conf.d/default.conf';
    const nginxConfigurator = new NginxConfigurator();

    nginxConfigurator.configureAndReload(nginxConfigurationPath)
        .then(() => {

            log('Nginx initialization succeed');

            const httpServer = new TemplateServer();
            httpServer.init();
        })
        .catch((e) => {
            log('Error while initializing Nginx configuration: ', e);
        });

};

// let time for nginx to set up
setTimeout(configureNginxAndLoadTemplater, 1000);
