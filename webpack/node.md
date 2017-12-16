# Nodejs

       node: {     
            __dirname: false, // disable mocking of these values by webpack
            __filename: false,
            fs: 'empty',    // disable fs import
            path: 'empty',
        },
     