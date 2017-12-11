import { IResourceRepresentation } from "./representations/IResourceRepresentation";

export interface IEvaluationPayload {
    resources: IResourceRepresentation[];
    context: { attributes: {} };
    roleIds: string[];
    clientId: string;
    userId: string;
    entitlements: boolean;
}
