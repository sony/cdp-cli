var webpack = require('webpack');
var banner = require('./tasks/banner');

module.exports = {
    target: 'node',
    entry: [
      './built/cdp-cli.js'
    ],
    output: {
        path: process.cwd() + '/dist',
        filename: 'cdp-cli.js',
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
        'jsdom': {
            commonjs: 'jsdom',
            commonjs2: 'jsdom',
        },
    },
    resolve: {
        alias: {
            'cdp-lib': '../submodules/cdp-lib/dist/cdp-lib.js',
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
