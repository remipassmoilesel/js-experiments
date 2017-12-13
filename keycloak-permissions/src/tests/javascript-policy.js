
// POLICY VARIABLES SHOULD BE CONCATENATED ABOVE

//
// VARIABLES DEFINITION
//

var context = $evaluation.getContext();
var identity = context.getIdentity();

var identityAttributes = identity.getAttributes();
var username = identityAttributes.getValue('preferred_username').asString(0);
var contextAttributes = context.getAttributes();

log("Policy evaluation for " + username);
log("Context attributes: " + contextAttributes.toMap());
log("Identity attributes: " + identityAttributes.toMap());

var resource = $evaluation.getPermission().getResource();
var resUri = resource.getUri();
var resName = resource.getName();
log("Resource name=" + resName + " uri=" + resUri);

var requiredScopes = $evaluation.getPermission().getScopes();

var clientUID = $evaluation.getPermission().getResourceServer().getId();
var clientName = contextAttributes.getValue('kc.client.id').asString(0);
log('Resource server name=' + clientName + ' UID=' + clientUID);

//
// EVALUATION FUNCTION
//

function evaluate() {
    log('Evaluating scopes for ' + username);

    if(!requiredScopes || requiredScopes.length < 1){
        log('No scopes found');
        return false;
    }

    var result = true;
    for(var i = 0; i < requiredScopes.length; i++){
        var scope = requiredScopes[i].getName();
        log('Evaluating scope: ' + scope);

        var rolePrefix = scopesMap[scope].rolePrefix;
        var expectedRole = rolePrefix + resUri;
        log('Expected client role: ' + expectedRole);

        if(!identity.hasClientRole(clientName, expectedRole)){
            log('Role not found: ' + expectedRole);
            result = false;
        }
    }

    log('All scopes required were found: ' + result);

    return result;
}

//
// POLICY EVALUATION
//

if(evaluate()){
    log('Authorization GRANTED !');
    $evaluation.grant();
} else {
    log('Authorization DENIED !');
    $evaluation.deny();
}



