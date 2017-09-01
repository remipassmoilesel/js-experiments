# Erreur d'import avec Node

En cas d'erreurs d'import sous Node:

    $ npm i -D @types/node
    $ vim tsconfig.json
    
    "compilerOptions": {
        "types": ["node"]
     },