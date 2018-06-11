'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        main: './src/index.ts',
    },
    devtool: 'cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, '..', './build'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    target: 'web',
    resolve: {
        modules: ['node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    },
    resolveLoader: {
        modules: ['node_modules'],
    },
    module: {
        rules: [
            {
                test: [
                    /\.bmp$/,
                    /\.gif$/,
                    /\.jpe?g$/,
                    /\.png$/,
                    /\.woff/,
                    /\.woff2/,
                    /\.eot/,
                    /\.ttf/,
                    /\.svg/,
                ],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 1000,
                    name: 'static/[name].[ext]'
                },
            },
            {
                test: /\.(ts|tsx)$/,
                include: path.resolve(__dirname, '..', './src'),
                loader: require.resolve('ts-loader'),
            },
        ],
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
    externals: [{
        "window": "window"
    }],
    performance: {
        hints: false,
    },
};
