const Menu = require('terminal-menu');
const {Menu1, Menu2} = require('./Menus');

const terminalWidth =  process.stdout.columns - 5;

const menu = Menu({ width: terminalWidth, x: 1, y: 1 });

new Menu1().display(menu);

menu.on('select', function (label, index) {
    console.log('SELECTED: ' + label);

    console.log(arguments);
    if(index == 0){
        new Menu2().display(menu);
    } else {
        menu.close();
    }
});
process.stdin.pipe(menu.createStream()).pipe(process.stdout);

process.stdin.setRawMode(true);
menu.on('close', function () {
    process.stdin.setRawMode(false);
    process.stdin.end();
});