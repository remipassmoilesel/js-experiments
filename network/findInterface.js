const _ = require('lodash');
const netif = require('netinterfaces');
const {execSync} = require('child_process');

/**
 * Find a valid network interface, with internet connectivity
 * @returns {string}
 */
function findValidNetworkInterface() {

    let validInterf = "";
    _.forOwn(netif.list(), (details, interf) => {
        try {
            console.log(`Trying ${interf}`);
            execSync(`curl --interface ${interf} http://wikipedia.com`, {stdio: 'ignore'});
            validInterf = interf;
            return false;
        } catch (e) {
            return true;
        }

    });

    return validInterf;
}

console.log(findValidNetworkInterface());