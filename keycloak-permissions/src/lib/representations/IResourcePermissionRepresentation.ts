export interface IResourcePermissionRepresentation {
    id?: string;
    name: string;
    type: "resource";
    logic: "POSITIVE";
    decisionStrategy: "UNANIMOUS" | "AFFIRMATIVE";
    resources?: string[];
    policies: string[];
    resourceType?: string;
}
