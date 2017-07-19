# Installation de Keycloak

## Installation du serveur

Télécharger et dézipper:

    $ cd /opt
    $ wget https://downloads.jboss.org/keycloak/3.2.0.Final/keycloak-3.2.0.Final.zip    
    $ unzip keycloak-3.2.0.Final.zip
    
Lancer en standalone:
    
    $ /opt/keycloak/bin/standalone.sh
    
Créer un compte admin sur:

    $ http://localhost:8080/auth/
    
    admin : admin
    
    
## Installation du driver NodeJS

    $ npm i --save keycloak-connect
    
