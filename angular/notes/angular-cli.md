# Angular CLI

## Installation

    $ sudo npm i -g @angular/cli
    $ sudo npm i -g @angular/cli@6      # Version spécifique
  

## Serveur de développement

Lancer un serveur webpack de dev:

    $ ng serve --watch --proxy-conf ./proxy.conf
    

Si le watch ne fonctionnent pas:    
    
    $ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
    
    
## Génération

    $ ng create module modulename
    $ ng create component componentname


