import {Model} from '../../../src/lib/entities/Model';
import {Machine} from '../../../src/lib/entities/Machine';
import {InfraState} from '../../../src/lib/entities/InfraState';
import {ScaleAction} from "../../../src/lib/entities/ScaleAction";
import {InfraConfig} from "../../../src/lib/entities/config/InfraConfig";
import {HttpRoutes} from "../../../src/lib/servers/HttpRoutes";
import {LoadTestScenario} from "../../../src/lib/entities/LoadTestingScenario";

const jQuery = require('jquery');

export class ApiClient {

    /**
     * Return all models as a Json array
     */
    public getModels(): Promise<Model[]> {

        return new Promise((resolve, reject) => {
            jQuery.ajax({url: HttpRoutes.MODELS_JSON_ALL}).then((data: any) => {
                resolve(data as Model[]);
            }).catch((error: Error) => {
                reject(error);
            });
        });

    }

    /**
     * Return all current machines as a Json array
     */
    public getMachines(): Promise<Machine[]> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.MACHINES_JSON_ALL}).then((data: any) => {
                resolve(data as Machine[]);
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    /**
     * Return infra state
     */
    public getInfraState(): Promise<InfraState> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.INFRA_STATE}).then((data: any) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    /**
     * Apply current infra
     */
    public applyInfra(): Promise<any> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.INFRA_CREATE}).then((data: any) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    /**
     * Destroy current infra
     */
    public destroyInfra(): Promise<any> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.INFRA_DESTROY}).then((data: any) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    /**
     * Apply current infra
     */
    public scale(value: ScaleAction): Promise<any> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.INFRA_SCALE + "/" + value.toString()}).then((data: any) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    public getLogList(): Promise<string[]> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.LOGS_LIST}).then((data: string[]) => {
                resolve(data.sort().reverse());
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    public getLog(name: string): Promise<string> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.LOGS_ROOT + "/" + name}).then((data: string) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    public getInfraConfig(): Promise<InfraConfig> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.INFRA_CONFIG}).then((data) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    public getActiveBots(): Promise<any> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.LOAD_TEST_ACTIVE}).then((data: string) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    public startLoadTests(scenario: LoadTestScenario): Promise<void> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.LOAD_TEST_START.replace(":scenarioId", String(scenario.id))})
                .then((data) => {
                    resolve(data);
                })
                .catch((error: Error) => {
                    reject(error);
                });

        });
    }

    public stopLoadTests(): Promise<void> {

        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.LOAD_TEST_STOP}).then((data) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    public getBotsErrors(): Promise<any> {
        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.LOAD_TEST_RESULTS}).then((data) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });

        });
    }

    getModelAsYaml(model: Model) {
        return new Promise((resolve, reject) => {

            jQuery.ajax({url: HttpRoutes.MODELS_YAML.replace(":name", String(model.name))})
                .then((data: string) => {
                    resolve(data);
                }).catch((error: Error) => {
                reject(error);
            });

        });
    }
}