
// POLICY VARIABLES SHOULD BE CONCATENATED ABOVE

// HELPERS

function log(msg) {
    if (debug) {
        print(msg);
    }
}

//
// VARIABLES DEFINITION
//

var context = $evaluation.getContext();
var identity = context.getIdentity();
var identityAttributes = identity.getAttributes();
var username = identityAttributes.getValue('preferred_username').asString(0);
var contextAttributes = context.getAttributes();

log("\n\nPolicy evaluation for " + username + " with group prefix: " + ROLE_PREFIX);
log("Context attributes: " + contextAttributes.toMap());
log("Identity attributes: " + identityAttributes.toMap());

var resource = $evaluation.getPermission().getResource();
var resUri = resource.getUri();
var resName = resource.getName();
log("Resource name=" + resName + " uri=" + resUri);

var expectedRole = ROLE_PREFIX + resUri;
log('Expected role: ' + expectedRole);

var requiredScopes = $evaluation.getPermission().getScopes();

var clientUID = $evaluation.getPermission().getResourceServer().getId();
var clientName = contextAttributes.getValue('kc.client.id').asString(0);
log('Resource server name=' + clientName + ' UID=' + clientUID);

//
// EVALUATION FUNCTIONS
//

function evaluateRole() {
    log('Searching role ' + expectedRole + ' for ' + username);
    var res = identity.hasClientRole(clientName, expectedRole);
    log('Role was found: ' + res);
    return res;
}

function evaluateScopes() {
    log('Evaluating scopes for ' + username);

    if(!requiredScopes || requiredScopes.length < 1){
        log('No scopes found');
        return false;
    }

    var res = true;
    for(var i = 0; i < requiredScopes.length; i++){
        var scope = requiredScopes[i].getName();
        log('Searching scope: ' + scope);
        if(authorizedScopes.indexOf(scope) === -1){
            log('Scope not found: ' + scope);
            res = false;
        }
    }

    log('All scopes required were found: ' + res);

    return res;
}

//
// POLICY EVALUATION
//

if(evaluateRole() && evaluateScopes()){
    $evaluation.grant();
} else {
    $evaluation.deny();
}



