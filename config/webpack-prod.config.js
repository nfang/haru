var merge         = require('merge');
var path          = require('path');
var root          = require('./util').root;
var commonConfig  = require('./webpack-common.config');

var prodConfig = {
  output: {
    path: path.resolve(root, 'dist'),
    filename: '[name].bundle.js'
  },

  debug: false,

  devtool: 'source-map',

  devServer: {
    contentBase: './dist',
    inline: true,
    noInfo: true,
    quite: true,
    host: '0.0.0.0',
    port: '9020',
    stats: { colors: true }
  }
};

module.exports = merge(commonConfig, prodConfig);
