# Cypress

Outil de test d'intégration.

Installation:

    $ npm install --save cypress
    
Lancement:

    $ vim package.json
    
    scripts: {
        "test-integration": "./node_modules/cypress/bin/cypress run --project ./src/tests/",
        "test-integration-gui": "./node_modules/cypress/bin/cypress open --project ./src/tests/"
    }    
    
Au premier lancement, des dossiers sont crées avec des templates. Les tests sont dans le dossier 
`cypress/integration`.

    