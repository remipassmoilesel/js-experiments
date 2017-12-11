export interface ClientRepresentation {
    id?: string;
    clientId: string;
    name: string;
    description: string;
    redirectUris: string[];
}