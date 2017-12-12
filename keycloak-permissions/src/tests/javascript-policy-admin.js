//
// POLICY FOR ADMINS
//

var ROLE_PREFIX = "admin_";
print("\n\nPolicy evaluation with group prefix: " + ROLE_PREFIX);

var identity = $evaluation.getContext().getIdentity();
print("Identity: " + identity.getId());

var attributes = identity.getAttributes();
print("Attributes: " + attributes.toMap());

var resource = $evaluation.getPermission().getResource();
var resUri = resource.getUri();
print("Resource uri: " + resUri);

var expectedRole = ROLE_PREFIX + resUri;
print('Expected role: ' + expectedRole);

if (identity.hasRealmRole(expectedRole)) {
    $evaluation.grant();
} else {
    $evaluation.deny();
}
