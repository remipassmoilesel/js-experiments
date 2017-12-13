
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

log("\n\nPolicy evaluation with group prefix: " + ROLE_PREFIX);

var context = $evaluation.getContext();
var contextAttributes = context.getAttributes();
log("Context attributes: " + contextAttributes.toMap());

var identity = context.getIdentity();
var identityAttributes = identity.getAttributes();
var username = identity.getAttributes().getValue('preferred_username').asString(0);
log("User name: " + username);
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
    log('result = ' + res);
    return res;
}

function evaluateScopes() {
    log('Evaluating scopes ' + requiredScopes + ' for ' + username);

    if(!requiredScopes || requiredScopes.size() < 1){
        log('No scopes found');
        return false;
    }

    var res = true;
    for(var i = 0; i < requiredScopes.size(); i++){
        var scope = requiredScopes.get(i);
        if(!authorizedScopes.includes(scope)){
            log('Scope not found: ' + scope);
            res = false;
        }
    }

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



