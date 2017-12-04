
class Menu1 {

    display(menu){

        console.log('class Menu1 {')

        menu.reset();
        menu.write('MENU 1\n');
        menu.write('-------------------------\n');

        menu.add('MENU 2');
        menu.add('BUSINESS INTELLIGENCE');
        menu.add('ACCOUNTS PAYABLE');
        menu.add('LEDGER BOOKINGS');
        menu.add('INDICATOR CHART METRICS');
        menu.add('BACKUP DATA TO FLOPPY DISK');
        menu.add('RESTORE FROM FLOPPY DISK');
        menu.add('EXIT');
    }

}

class Menu2 {

    display(menu){

        console.log('class Menu2 {')

        menu.reset();
        menu.write('MENU 2\n');
        menu.write('-------------------------\n');

        menu.add('ADD TRANSACTION INVOICE');
        menu.add('BUSINESS INTELLIGENCE');
        menu.add('ACCOUNTS PAYABLE');
        menu.add('LEDGER BOOKINGS');
        menu.add('INDICATOR CHART METRICS');
        menu.add('BACKUP DATA TO FLOPPY DISK');
        menu.add('RESTORE FROM FLOPPY DISK');
        menu.add('EXIT');
    }

}

module.exports = {Menu1, Menu2};
