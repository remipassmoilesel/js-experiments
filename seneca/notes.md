 # Notes sur Seneca
 
Afficher les journaux Seneca et les filtrer:
 
    $ node basics.js --seneca.log.all | grep DEFINE | jq '.'  
    
Afficher l'arbre d'actions:

    $ node math-tree.js --seneca.print.tree

Options de seneca:

    date-time:                  when the log entry occurred.
    seneca-id:                  identifier for the Seneca process.
    level:                      one of DEBUG, INFO, WARN, ERROR, FATAL.
    type:                       entry code, such as act, plugin, etc.
    plugin:                     plugin name (actions without a plugin have root$).
    case:                       entry case, such as IN, OUT, ADD, etc.
    action-id/transaction-id:   tracing identifier, stays the same over the network.
    pin:                        the action pattern for this message.
    message:                    the inbound or outbound message (truncated if too long).