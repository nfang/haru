var webpackMerge = require('webpack-merge');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var root = require('./util').root;
var commonConfig = require('./webpack-common.config');

module.exports = webpackMerge(commonConfig, {
  output: {
    path: path.resolve(root, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
    chunkFilename: '[id].[hash].chunk.js'
  },

  debug: false,

  devtool: 'source-map',

  htmlLoader: {
    minimize: false // workaround for ng2
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('[name].[hash].css')
  ]
});
