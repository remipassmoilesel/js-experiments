# Expérimentation de serveur d'applications Front

## But de l'expérimentation

Trouver une solution de service d'applications front pouvant déterminer en fonction de paramétres variables:

- Quelle application servir
- Quels paramètres injecter
- Quelles ressources statiques servir

Cette expérimentation a été réalisée en une heure, elle n'est pas complète et ne doit pas combler tous 
les besoins.

## Utilisation

Modifier le fichier /etc/hosts:

    $ vim /etc/hosts
    
    127.0.0.1 domain1.com
    127.0.0.1 domain2.com

Lancer l'application:

    $ cd front-server
    $ npm install
    $ npm run start

Visiter ensuite: 
    
    http://domain1.com:3080/
    http://domain2.com:3080/
    
## Perspectives

- Les ressources statiques doivent être servis à terme avec un serveur HTTP traditionnel (NGinx)
- Si le besoin est avéré, les ressources statiques doivent être mutualisable 
- Ne pas utiliser de redirections pour les ressources statiques (problème résolu si utilisation d'un serveur 
HTTP statique)    
    
