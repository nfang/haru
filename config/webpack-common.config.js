var path    = require('path');
var webpack = require('webpack');
var util    = require('./util');
var root    = util.root;

/**
 * Plugins
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'app': './app/bootstrapper',
    'vendor': ['reflect-metadata', 'zone.js/dist/zone']
  },

  resolve: {
    extensions: ['', '.ts', '.js'],
    root: path.resolve(root, 'app'),
    modulesDirectories: ['node_modules']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript',
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'html'
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js'
    }),

    new HtmlWebpackPlugin({
      template: './app/index.html',
      chunksSortMode: util.sortBy(['vendor', 'app'])
    })
  ]
};
