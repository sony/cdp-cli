var webpack = require('webpack');
var banner = require('./tasks/banner');

module.exports = {
    target: 'node',
    entry: [
      './built/cdp-lib.js'
    ],
    output: {
        path: process.cwd() + '/dist',
        filename: 'cdp-lib.js',
        libraryTarget: 'commonjs2',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre",
            },
        ],
    },
    // externals を指定しない場合、3rd Library の使用するものを concat 可能
    externals: {
        'fs-extra': {
            commonjs: 'fs-extra',
            commonjs2: 'fs-extra',
        },
        'jquery': {
            root: 'jQuery',
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery'
        },
        'hogan.js': {
            root: 'Hogan',
            commonjs: 'hogan.js',
            commonjs2: 'hogan.js',
            amd: 'hogan.js'
        },
        'jsdom': {
            commonjs: 'jsdom',
            commonjs2: 'jsdom',
        },
        'xmldom': {
            commonjs: 'xmldom',
            commonjs2: 'xmldom',
        },
        'glob': {
            commonjs: 'glob',
            commonjs2: 'glob',
        },
        'lodash': {
            root: '_',
            commonjs: 'lodash',
            commonjs2: 'lodash',
        },
        'uuid': {
            commonjs: 'uuid',
            commonjs2: 'uuid',
        },
        'semver-regex': {
            commonjs: 'semver-regex',
            commonjs2: 'semver-regex',
        },
        'underscore.string': {
            root: '_',
            commonjs: 'underscore.string',
            commonjs2: 'underscore.string',
        },
        'which': {
            commonjs: 'which',
            commonjs2: 'which',
        },
        'chalk': {
            commonjs: 'chalk',
            commonjs2: 'chalk',
        },
        'cli-spinner': {
            commonjs: 'cli-spinner',
            commonjs2: 'cli-spinner',
        },
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new webpack.BannerPlugin({
            banner: banner('.js'),
            raw: true,
            ntryOnly: true,
        }),
    ],
};
