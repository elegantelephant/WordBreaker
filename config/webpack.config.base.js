const webpack = require('webpack');
const path = require('path');

// Phaser webpack config
const phaserModule = path.join(__dirname, '../node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

const config = {
    context: path.resolve(__dirname, '../src'),
    entry: {
        app: ['./app.js'],
        vendor: ['lodash', 'firebase', 'pixi', 'p2', 'phaser', 'webfontloader']
    },
    output: {
        filename: '[name].bundle.js',
        pathinfo: true,
        path: path.resolve(__dirname, '../dist/assets/'),
        publicPath: 'assets/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }]
            },
            {
                test: /pixi\.js/,
                use: [{
                    loader: 'expose-loader',
                    options: 'PIXI'
                }]
            },
            {
                test: /phaser-split\.js$/,
                use: [{
                    loader: 'expose-loader',
                    options: 'Phaser'
                }]
            },
            {
                test: /p2\.js/,
                use: [{
                    loader: 'expose-loader',
                    options: 'p2'
                }]
            },
            {
                test: /src\/.*\.(html)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]',
                        outputPath: '../',
                        publicPath: '/'
                    }
                }]
            },
            {
                test: /assets\/.*\.(css|CSS|jpe?g|JPE?G|gif|GIF|png|PNG|svg|SVG|woff|WOFF|ttf|TTF|wav|WAV|mp3|MP3|html|HTML|ico|ICO|txt|TXT)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: 'vendor.bundle.js'/* filename= */})
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'Phaser': phaser,
            'pixi': pixi,
            'PIXI': pixi,
            'p2': p2
        }
    }
};

module.exports = config;
