# Expérimentation

Voir: http://www.keycloak.org/docs/latest/authorization_services/index.html#_getting_started_hello_world_overview

Créer un realm:

    Select realm > Add realm
    
    "library-poc" > create
    
Créer un client, pour accéder à resource server:

    Clients > Add clients
    Name: "library-api_client"    
    Redirect address: "http://library-api.local"
    "Authorization enabled"

Créer des scopes:

    Clients > Authorization > Resources
    Authorization scope
    Create new
    Name: "Edit" 
    Name: "View" 
    
Créer des ressources à protéger:

    Clients > Authorization > Resources
    Create resource
    Name: "library_a"
    Type: "library-api:library"   -> UID pour identifier le type
    URI: "/library-a"             -> URL locale
    Scopes: "Edit" "View"  
    
Pour créer des ressources dynamiquement, voir la [Protection API](http://www.keycloak.org/docs/latest/authorization_services/index.html#_service_protection_api).

Créer des rôles:

    Roles > Create role
    Name: library_admin
    Name: library_user
    
Créer des rôles de client:

    Clients > Roles > Create role
    Name: library_admin
    Name: library_user
    
Créer des policy:

    Clients > Authorization > Policies
    Create policy > Role based policy
    Name: "admin can edit"
    Realm roles: "library_admin" + Required       -> L'utilisateur devra avoir ce rôle
    Client: "library_api"
    Client role: "library_admin" + Required       -> L'utilisateur devra avoir ce rôle
    
    admin can administrate
    users can access
    group a can access library a    
    group b can access library b
    
    admin a can administrate lib a    
    admin b can administrate lib b    
    
Créer des groupes:

    group_library_a
    group_library_b    
    
Créer des utilisateurs:

    Users > Add user
    "user_a"
    "user_b"    
    "admin_a"    
    "admin_b"
    
Attribuer des rôles aux utilisateurs:

    Users > Roles mapping           
    
Créer des permissions pour lier des polices aux ressources.
     



        

    
        