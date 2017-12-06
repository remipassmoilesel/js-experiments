# Setup Karma / Typescript

## Avec karma-cli

    $ sudo npm install -g karma-cli
    $ karma init

## Manuel

Créer une ou plusieurs tâches NPM:

      "test": "NODE_ENV=dev ./node_modules/karma/bin/karma start config/karma.conf.js --single-run",
      "test-watch": "NODE_ENV=dev ./node_modules/karma/bin/karma start config/karma.conf.js"
      
Créer une configuration:
     
     module.exports = function (config) {
         config.set({
     
         // base path that will be used to resolve all patterns (eg. files, exclude)
             basePath: '',
     
     
             // frameworks to use
             // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
             frameworks: ['mocha', 'chai', 'sinon'],
     
     
             // list of files / patterns to load in the browser
             files: [
                 'src/**/*.ts',
                 'src/tests/**/*.ts',
             ],
     
     
             // list of files to exclude
             exclude: [
             ],
     
     
             // preprocess matching files before serving them to the browser
             // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
             preprocessors: {
                 'src/**/*.ts': ['webpack', 'sourcemap'],
             },
     
            webpack: webpackConfig,
            
            // Can fix problem of error: Chrome 62.0.3202 (Linux 0.0.0): Executed 0 of 0 ERROR (0.007 secs / 0 secs)
            // Typescript files are served with mpeg mimetype so they are not executed
            mime: {
                'text/x-typescript': ['ts', 'tsx'],
            },
     
             // test results reporter to use
             // possible values: 'dots', 'progress'
             // available reporters: https://npmjs.org/browse/keyword/karma-reporter
             reporters: ['spec', 'progress'],
     
     
             // web server port
             port: 9876,
     
     
             // enable / disable colors in the output (reporters and logs)
             colors: true,
     
     
             // level of logging
             // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
             logLevel: config.LOG_DEBUG,
     
     
             // enable / disable watching file and executing tests whenever any file changes
             autoWatch: true,
     
     
             // start these browsers
             // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
             browsers: ['Chrome'],
     
     
             // Continuous Integration mode
             // if true, Karma captures browsers, runs the tests and exits
             singleRun: false,
     
             // Concurrency level
             // how many browser should be started simultaneous
             concurrency: Infinity,
         });
     };
  

Installer les dépendances:

    $ npm install --save-dev karma karma-chai karma-chrome-launcher karma-webpack karma-mocha \
        karma-sinon karma-webpack karma-sourcemap-loader karma-sourcemap-writer chai mocha webpack \
        karma-spec-reporter
        
        