# Expérimentation de serveur d'applications Front

## But de l'expérimentation

Trouver une solution de service d'applications front pouvant déterminer en fonction de paramétres variables:

- Quelle application servir
- Quels paramètres injecter
- Quelles ressources statiques servir

Cette expérimentation a été réalisée en quelques heures, elle n'est pas complète et ne doit pas encore combler tous 
les besoins.

## Utilisation

Lancer l'application dans un docker:

    $ cd front-server
    $ npm install
    $ npm run start
    
La première construction peut prendre du temps.    

Modifier le fichier /etc/hosts:

    $ vim /etc/hosts
    
    172.17.0.1 domain1.com
    172.17.0.1 domain2.com

Visiter ensuite: 
    
    http://domain1.com/
    http://domain2.com/

## Ajouter une application

- Créer un build webpack d'application. Toute autre ressource que `index.html` doit être placé dans un 
dossier nommé `static`. 
- Ajouter le build dans un sous-dossier de `front-applications`.
- Ajouter une configuration:

    ```
    $ vim config.js
    
    module.exports = [
    
        ...
    
        {
            id: 'domain3',
            hostname: 'domain3.com',
            baseDirectory: 'app3',
            templatedConfiguration: {
                apiUrl: 'http://backend.domain3.com',
                parameter1: 'value3',
            },
        },
        
        ...
        
    ];
    ```
   
La section `templatedConfiguration` permet d'injecter des variables dans le fichier `index.html` du build webpack.   
    
## Fonctionnement

**Le choix de l'application** servie se fait sur la base du `hostname`.

**Les fichiers `index.html`** sont servi par un serveur Express, qui peut les modifier à la volée. Une configuration
est injectée si demandé. Exemple:

    window.appConfig = JSON.parse('<%- appConfig -%>');

**Les ressources statiques** sont servies par Nginx.

## Perspectives

- Si le besoin est avéré, les ressources statiques doivent être mutualisable 
- Servir une application pour un chemin particulier    
- Répondre aux sub urls et urls
