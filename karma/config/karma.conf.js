const webpackConfig = require('./webpack.config');

module.exports = (config) => {
    config.set({
        basePath: '..',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            'config/karma.test-config.js',
            './src/test/**/*.tsx',
            './src/test/**/*.ts',
        ],
        exclude: [
        ],
        preprocessors: {
            './src/**/*.tsx': ['webpack', 'sourcemap'],
            './src/**/*.ts': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['jsdom'],
        concurrency: Infinity
    })
};
