import * as express from 'express';
import { Express } from 'express';
import * as ejs from 'ejs';
import * as _ from 'lodash';
import * as path from 'path';
import { IFrontApplicationConfig } from './IFrontApplicationConfig';
import { log } from '../utils';
import { appConfigurations } from '../index';

const projectRoot = path.resolve(__dirname, '..', '..');
const frontApplicationsRoot = path.resolve(projectRoot, 'front-applications');
const port = process.env.PORT || 3080;

log(`Initialized with configuration: ${JSON.stringify(appConfigurations, null, 2)}`);

// TODO: setup several caches for configuration search
export class TemplateServer {
    private app: Express;

    public init() {
        this.app = express();

        this.configureTemplateEngine();
        this.configureStaticServices();

        // Template index with configuration for each non static request
        this.app.use(/^(?!\/static).*/, (req, res) => {

            const hostname = req.headers.host.split(':')[0];
            log(`Receiving request from: ${hostname}`);

            res.render(
                this.getIndexForHostname(hostname),
                {
                    appConfig: JSON.stringify(this.getConfigForHostname(hostname).templatedConfiguration),
                },
            );

        });

        // Serve static files
        this.app.use(/^\/static[^_].*/, (req, res) => {

            const hostname = req.headers.host.split(':')[0];
            log(`Receiving static request from: ${hostname}`);

            const originalReq = req.originalUrl.substr('/static'.length);
            const staticPath = this.getStaticPathForHostname(hostname) + originalReq;

            log(`Redirected to: ${staticPath}`);

            res.redirect(staticPath);

        });

        this.app.listen(port, () => {
            log();
            log(`Listening on http://0.0.0.0:${port}`);
            log();
        });

    }

    private configureTemplateEngine() {
        this.app.set('views', frontApplicationsRoot);
        this.app.engine('html', ejs.renderFile);
        this.app.set('view engine', 'html');
    }

    /**
     * Although we can serve static files with express, we prefer
     * use Nginx instead
     *
     */
    private configureStaticServices() {
        _.forEach(appConfigurations, (config) => {
            const route = this.getStaticRouteForConfig(config);
            log(`Serve static files for ${config.hostname} on route ${route}`);
            this.app.use(route, express.static(path.join(frontApplicationsRoot, 'static')));
        });
    }

    private getIndexForHostname(hostname: string): string {
        return this.getConfigForHostname(hostname).baseDirectory + '/index';
    }

    private getConfigForHostname(hostname: string): IFrontApplicationConfig {

        const configs = _.filter(appConfigurations, (config: IFrontApplicationConfig) => {
            return config.hostname.trim() === hostname.trim();
        });

        if (configs.length !== 1) {
            throw new Error(`Invalid configuration number found, it should be unique.`
                + ` Hostname=${hostname} Number=${configs.length}`);
        }

        return configs[0];
    }

    private getStaticPathForHostname(hostname: any) {
        return this.getStaticRouteForConfig(this.getConfigForHostname(hostname));
    }

    private getStaticRouteForConfig(config: IFrontApplicationConfig): string {
        return `/static_${config.id}`;
    }
}
