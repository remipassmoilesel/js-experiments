# Utilisation

## Bases

Ligne de commande:

    $ mongo
    
Afficher de l'aide:

    > db.help()
    
Afficher des stats:

    > db.stats()
  
## Base de données
    
Utiliser une base de données (crée si non existante):

    > use db_name
    
Afficher le nom courant de la base de données:

    > db
    
Afficher toutes les BDD disponibles, si elles contiennet au moins un document:

    > show dbs
    
Insérer un document:

    > db.movie.insert({"name":"Seul sur mars"})
    
Supprimer une BDD:

    > use database1
    > db.dropDatabase()
    
## Collections
    
Créer une collection:

    > use db1
    > db.createCollection("collectionName")
    > db.createCollection("collectionName2", {
            capped : true,          // collection de taille fixe, écrasement des derniers enregistrements une fois le max atteint
            size : 10000,           // taille en octets de collection si de type 'capped'
            autoIndexId : true,     // créer un index auto sur _id
            max : 10                // nombre max de collections
        }

Afficher les collections d'une BDD:

    > use db1
    > show collections
    > db.getCollectionNames()

Supprimer une collection:

    > db.COLLECTION_NAME.drop()
    
Insérer un document (créer une collection si non existante):
    
    > db.COLLECTION_NAME.insert({
                document : document 
            })
            
    > db.post.insert([
       {
            ... document 1 ...
       },
       {
            ... document 2 ...
       }])

## Importer

    $ mongoimport --db test --collection restaurants --drop --file ~/downloads/primer-dataset.json

