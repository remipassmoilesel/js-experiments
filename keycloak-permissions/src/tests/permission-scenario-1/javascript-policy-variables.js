
// HELPERS
var debug = true;
function log(msg) {
    if (debug) {
        print(msg);
    }
}

log('\n\nStarting policy evaluation');

//
// POLICY VARIABLES
//

var scopesMap = {
    ADMINISTRATE: {
        rolePrefix: "admin_"
    },
    USE: {
        rolePrefix: "user_"
    }
};
