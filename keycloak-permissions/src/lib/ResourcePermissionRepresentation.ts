export interface ResourcePermissionRepresentation {
    id?: string;
    name: string;
    type: 'resource';
    logic: 'POSITIVE';
    decisionStrategy: 'UNANIMOUS';
    resources: string[],
    policies: string[]
}
