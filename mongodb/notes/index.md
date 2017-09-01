# Les index

Les index sont indispensables pour utiliser éfficacement MongoDB.
 
Créer un index:
    
    > db.restaurants.ensureIndex({"restaurant_id": 1})

Supprimer un index:
    
    > db.restaurants.dropIndex({"restaurant_id": 1})
    
Plusieurs options sont disponibles:

    > db.restaurants.ensureIndex({"restaurant_id": 1}, {unique: true}) // index unique

