# Concepts

Database
    -> Conteneur de collections
    
Collection
    -> Groupe de documents
    
Document
    -> Ensemble de clefs/valeurs
    -> Les documents sont dynamiques, une collection peut contenir des documents de structure différentes
    
    
## Exemple de document

    {
       _id: ObjectId(7df78ad8902c)
       title: 'MongoDB Overview', 
       description: 'MongoDB is no sql database',
       by: 'tutorials point',
       url: 'http://www.tutorialspoint.com',
       tags: ['mongodb', 'database', 'NoSQL'],
       likes: 100, 
       comments: [	
          {
             user:'user1',
             message: 'My first comment',
             dateCreated: new Date(2011,1,20,2,15),
             like: 0 
          },
          {
             user:'user2',
             message: 'My second comments',
             dateCreated: new Date(2011,1,25,7,45),
             like: 5
          }
       ]
    }
    
    _id = identifiant unique de document, à fournir ou non