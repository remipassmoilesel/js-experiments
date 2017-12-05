# Notes Webpack

Tâche de build production (-p):

    "clean-compile": "webpack --progress --colors -p --config ./config/webpack.config.prod.js",
    
Tache de build dev watch (-w):

    "compile-watch": "webpack --progress --colors -w --config ./config/webpack.config.dev.js",
    
Exporter un build comme dépendance (library):

        output: {
            filename: './dist/bee-auth-helper.js',
            library: 'BeeAuthHelper',
            libraryTarget: 'umd',
        },        