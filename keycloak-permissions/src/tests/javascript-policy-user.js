//
// POLICY FOR ADMIN
//

var GROUP_PREFIX = "user_";
print("\n\nPolicy evaluation with group prefix: " + GROUP_PREFIX);

var identity = $evaluation.getContext().getIdentity();
print("Identity: " + identity);

var attributes = identity.getAttributes();
print("Attributes: " + attributes.toMap());

var groups = attributes.getValue("groups");
print("Groups: " + groups);

var resource = $evaluation.getPermission().getResource();
var resUri = resource.getUri();
print("Resource uri: " + resUri);

if(!groups){
    print("No groups found, deny");
    $evaluation.deny();
} else {
    var expectedGroup = GROUP_PREFIX + resUri;
    if(attributes.getValue("groups").contains(expectedGroup)){
        $evaluation.grant();
    } else {
        $evaluation.deny();
    }
}
