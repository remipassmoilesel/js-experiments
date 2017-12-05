# Setup Karma / Typescript

Créer une ou plusieurs tâches NPM:

      "test": "NODE_ENV=dev ./node_modules/karma/bin/karma start config/karma.conf.js --single-run",
      "test-watch": "NODE_ENV=dev ./node_modules/karma/bin/karma start config/karma.conf.js"
      
Créer une configuration:

    const webpackConfig = require('./webpack.config.dev');
    
    module.exports = (config) => {
        config.set({
            basePath: '',
            frameworks: ['mocha', 'chai', 'sinon'],
            files: [
                '../src/tests/**/*.ts',
            ],
            exclude: [
            ],
            preprocessors: {
                '../src/tests/**/*.ts': ['webpack', 'sourcemap'],
            },
            webpack: webpackConfig,
            reporters: ['progress', 'spec'],
            port: 9876,
            colors: true,
            logLevel: config.LOG_DEBUG,
            autoWatch: true,
            browsers: ['Chrome'],
            concurrency: Infinity,
        });
    };


Installer les dépendances:

    $ npm install --save-dev karma karma-chai karma-chrome-launcher karma-webpack karma-mocha \
        karma-sinon karma-webpack karma-sourcemap-loader karma-sourcemap-writer chai mocha webpack \
        karma-spec-reporter
        
        