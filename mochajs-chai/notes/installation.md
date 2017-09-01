# Installation de MochaJs

Installation:

    $ npm install --global mocha
    
Premier test:

    $ mocha mocha.js
    
Utiliser avec NPM:

    $ vim package.json
    
    ...
      "scripts": {
        "test": "mocha"
      },
    ...
    
    $ npm test
    
Changer de reporteur:    

    $ npm install --save-dev karma-nyan-reporter
    $ mocha --reporter nyan chai.js