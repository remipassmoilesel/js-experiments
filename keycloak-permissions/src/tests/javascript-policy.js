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

var identity = $evaluation.getContext().getIdentity();
log("Identity: " + identity.getId());

var attributes = identity.getAttributes();
log("Attributes: " + attributes.toMap());

var resource = $evaluation.getPermission().getResource();
var resUri = resource.getUri();
log("Resource uri: " + resUri);

var expectedRole = ROLE_PREFIX + resUri;
log('Expected role: ' + expectedRole);

var scopes = $evaluation.getPermission().getScopes();

//
// EVALUATION FUNCTIONS
//

function evaluateRole(identity) {
    log('Evaluating role for ' + identity.getId());
    var res = identity.hasClientRole(clientId, expectedRole);
    log('result = ' + res);
    return res;
}

function evaluateScopes(requiredScopes, identity) {
    log('Evaluating scopes for ' + requiredScopes + ' / ' + identity.getId());

    if(!requiredScopes || requiredScopes.size() < 1){
        log('No scopes found');
        return false;
    }

    var res = true;
    for(var i = 0; i < requiredScopes.size(); i++){
        var scope = requiredScopes.get(i);
        if(!authorizedScopes.includes(scope)){
            res = false;
        }
    }

    return res;
}

//
// POLICY EVALUATION
//

if(evaluateRole(identity) && evaluateScopes(scopes, identity)){
    $evaluation.grant();
} else {
    $evaluation.deny();
}



