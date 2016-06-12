var webpackMerge = require('webpack-merge');
var path = require('path');
var root = require('./util').root;
var commonConfig = require('./webpack-common.config');

module.exports = webpackMerge(commonConfig, {
  output: {
    path: path.resolve(root, '.tmp'),
    filename: '[name].bundle.js'
  },

  debug: true,

  devtool: 'cheap-module-eval-source-map',

  devServer: {
    historyApiFallback: true,
    contentBase: './.tmp',
    inline: true,
    host: '0.0.0.0',
    port: '9010',
    stats: 'minimal'
  }
});
