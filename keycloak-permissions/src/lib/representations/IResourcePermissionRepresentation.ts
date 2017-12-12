export interface IResourcePermissionRepresentation {
    id?: string;
    name: string;
    type: "resource";
    logic: "POSITIVE";
    decisionStrategy: "UNANIMOUS";
    resources?: string[];
    policies: string[];
    resourceType?: string;
}
