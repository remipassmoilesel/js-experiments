import * as path from 'path';
import * as ejs from 'ejs';
import * as fs from 'fs-extra';
import { spawn } from 'child_process';
import { appConfigurations } from '../index';
import { log } from '../utils';

const projectRoot = path.resolve(__dirname, '..', '..');
const templatePath = path.join(projectRoot, 'templates/nginx.conf.ejs');

export class NginxConfigurator {

    public configureAndReload(configFinalPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.templateConfiguration(configFinalPath)
                .then(() => {
                    setTimeout(() => {
                        this.reloadNginx()
                            .then(resolve)
                            .catch(reject);
                    }, 1000);
                })
                .catch(resolve);
        });

    }

    private templateConfiguration(finalpath: string): Promise<void> {

        return new Promise((resolve, reject) => {
            ejs.renderFile(templatePath, { frontApps: appConfigurations }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    fs.writeFileSync(finalpath, data);
                    log(`Nginx configuration templated with success at location: ${finalpath}`);
                    resolve();
                }
            });
        });

    }

    private reloadNginx(): Promise<void> {

        return new Promise((resolve, reject) => {
            log('Reloading nginx');

            const child = spawn('nginx -s reload',[], { shell: true });
            child.stdout.on('data', (data) => {
                log(` [NGINX] stdout: ${data}`);
            });
            child.stderr.on('data', (data) => {
                log(` [NGINX] stderr: ${data}`);
            });

            child.on('close', (code) => {
                if (code === 0) {
                    log('Nginx configuration reloaded');
                    resolve();
                } else {
                    log(`Error while reloading nginx configuration: ${code}`);
                    reject(new Error('Nginx exit code: ' + code));
                }
            });

        });

    }
}
