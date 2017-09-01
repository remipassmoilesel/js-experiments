# Requêtes

## Rechercher

Rechercher par égalité:

    > db.post.find({'title':'MongoDB Overview'}).pretty();

        {
                "_id" : ObjectId("596e6afe0d4935f1cd6629e3"),
                "title" : "MongoDB Overview",
                "description" : "MongoDB is no sql database",
                "by" : "tutorials point",
                "url" : "http://www.tutorialspoint.com",
                "tags" : [
                        "mongodb",
                        "database",
                        "NoSQL"
                ],
                "likes" : "100"
        }

Rechercher le premier seulement:

    > db.post.findOne(...)
    
Plus petit que:
    
    > db.post.find({'likes':{$lt:200}}).pretty();
    
Plus grand ou égal à:
    
    > db.post.find({'likes':{$gte:200}}).pretty();

Non égal à:
    
    > db.post.find({'likes':{$ne:200}}).pretty();

Et:

    > db.find({key1: value1}, {key2:value2});

    > db.find({ $and: [{key1: value1}, {key2:value2}] });

Ou:

    {
        $or: [
            {key1: value1}, {key2:value2}
        ]
    }

## Update

Mettre à jour un document:
 
    > db.COLLECTION_NAME.update(SELECTION_CRITERIA, UPDATED_DATA)
    
    > db.restaurants.updateOne({"restaurant_id": "40356018"}, {$set:{name: "Riviera Carterer 2"}});
    { "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

Mettre à jour plusieurs documents:

    > db.restaurants.updateOne(
                                {"restaurant_id": "40356018"}, 
                                {$set:{name: "Riviera Carterer 2"}},
                                {multi:true}
                            );
Remplacer un document:

    > db.COLLECTION_NAME.save({_id:ObjectId(),NEW_DATA})

Supprimer un document:

    > db.COLLECTION_NAME.remove(DELLETION_CRITTERIA)

    > db.restaurants.remove({"restaurant_id": "40356018"}, 1); // 1: delete only one / 0: delete many

Vider une table:

    > db.mycol.remove()

## Projection

Restreindre la sélection à quelques champs:

    > db.restaurants.find({},{"restaurant_id": 1}); // 1: display / 0: hide
    > db.restaurants.find({},{"restaurant_id": 0}); 
    
## Limit, offset, ...

Limit:

    > db.restaurants.find({},{"restaurant_id": 0}).limit(2);
    
Offset:
    
    > db.restaurants.find({},{"restaurant_id": 0}).limit(2).skip(5);

Sort:

    > db.restaurants.find({},{"restaurant_id": 1}).sort({"restaurant_id":1});






