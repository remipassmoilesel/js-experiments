# Installer Babel

Pour transpiler en ES5, dans le but d'être compatible avec cette ...... de Internet Explorer notamment.

Créer un fichier .babelrc, avec le nom du preset d'ES utilisée dans le code:

    $ vim .babelrc
    
    {
      "presets": ["es2015"]
    }

Installer les dépendances:

    $ npm i --save-dev babel-core babel-loader babel-preset-env babel-preset-es2015

Pour transpiler des dépendances (node_modules), créer un .babelrc dans la dépendance, puis installer le preset:

    $ npm i --save-dev babel-preset-es2015

    
