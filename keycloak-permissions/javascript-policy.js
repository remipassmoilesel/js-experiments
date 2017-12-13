// KEYCLOAK JAVASCRIPT POLICY EXAMPLE

//
// AVAILABLE VARIABLES
//

var identity = $evaluation.getContext().getIdentity();
print('Identity: ' + identity);

var attributes = identity.getAttributes();
print('Attributes: ' + attributes);
print('Attributes: ' + attributes.toMap());

// Example output: Attributes: {sub=[58c56e68-8c19-408e-bddd-8a363310d071], kc.realm.roles=[uma_authorization],
// kc.client.account.roles=[manage-account, manage-account-links, view-profile], typ=[Bearer],
// preferred_username=[usera], aud=[000_client1], acr=[1], nbf=[0], azp=[000_client1], auth_time=[0],
// exp=[1513083964], session_state=[c228771c-1321-41c2-8a84-0ded09f4ac4e], iat=[1513083664],
// jti=[8e034d62-822c-4cf0-9e4a-749bc3fa2fbb]}

var resource = $evaluation.getPermission().getResource();
print('Resource: ' + resource);
print('Resource: ' + resource.getId());
print('Resource: ' + resource.getName());
print('Resource: ' + resource.getType());
print('Resource: ' + resource.getIconUri());
print('Resource: ' + resource.getResourceServer());

// see more in keycloak code: Resource.java

//
// POLICY EXAMPLE
//

var identity = $evaluation.getContext().getIdentity();
print('Identity: ' + identity);

var attributes = identity.getAttributes();
print('Attributes: ' + attributes.toMap());

var groups = attributes.getValue('groups');
print('Groups: ' + groups);

var resource = $evaluation.getPermission().getResource();
print('Resource uri: ' + resource.getUri());

var scopes = $evaluation.getPermission().getScopes();
print('Scopes: ' + scopes.get(0).getName());

if (!groups) {
    print('No groups found, deny');
    $evaluation.deny();
} else {

    var groupsNumber = groups.size();

    for (i = 0; i < groupsNumber; i++) {
        var group = attributes.getValue('groups').asString(i);
        if (resource.getUri().indexOf(group) === 0) {
            $evaluation.grant();
        }
    }
}
