import * as express from 'express';
import { Express } from 'express';
import * as ejs from 'ejs';
import * as _ from 'lodash';
import * as path from 'path';
import { IFrontApplicationConfig } from './IServerConfig';
import { log } from './utils';

const projectRoot = path.resolve(__dirname, '..');
const configurations: IFrontApplicationConfig[] = require(path.resolve(projectRoot, 'config'));
const frontApplicationsRoot = path.resolve(projectRoot, 'front-applications');
const port = process.env.PORT || 3080;

log(`Initialized with configuration: ${JSON.stringify(configurations, null, 2)}`);

export class HttpServer {
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

    private configureStaticServices() {
        _.forEach(configurations, (config) => {
            const route = this.getStaticRouteForConfig(config);
            log(`Serve static files for ${config.hostname} on route ${route}`);
            this.app.use(route, express.static(path.join(frontApplicationsRoot, config.staticDirectory)));
        });
    }

    private getIndexForHostname(hostname: string): string {
        return this.getConfigForHostname(hostname).baseDirectory + '/index';
    }

    private getConfigForHostname(hostname: string): IFrontApplicationConfig {

        const configs = _.filter(configurations, (config: IFrontApplicationConfig) => {
            return config.hostname.trim() === hostname.trim();
        });

        if (configs.length !== 1) {
            throw new Error('Invaldi configuration number found');
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
