const path = require('path');
const webpack = require('webpack');

// Load base config
const baseConfig = require('./webpack.config.base');

// Create the config
const config = Object.create(baseConfig);

config.devtool = 'cheap-source-map';

config.devServer = {
    contentBase: path.resolve(__dirname, '../src'),
    watchContentBase: true
};

module.exports = config;
