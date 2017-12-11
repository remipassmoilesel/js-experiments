export interface IPolicyRoleBasedRepresentation {
    type: "role";
    logic: "POSITIVE";
    name: string;
    roles: IPolicyRole[];
}

export interface IPolicyRole {
    id: string;
    required: boolean;
}
