var path = require('path');
var webpack = require('webpack');
var util = require('./util');
var root = util.root;
var autoprefixer = require('autoprefixer');

/**
 * Plugins
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'polyfills': './app/polyfills.ts',
    'vendor': './app/vendor.ts',
    'app': './app/bootstrapper'
  },

  resolve: {
    extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
    root: path.resolve(root, 'app')
  },

  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts'
    }, {
      test: /\.css$/,
      loader: 'style!css!postcss'
    }, {
      test: /\.scss$/,
      loader: 'raw!postcss!sass!source-map'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.html$/,
      loader: 'raw'
    }, {
      test: /\.(woff2?|ttf|eot|svg)$/,
      loader: 'url?limit=10000'
    }]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: './app/index.html',
      chunksSortMode: util.sortBy(['polyfills', 'vendor', 'app'])
    })
  ],

  postcss: function() {
    'use strict';
    return [autoprefixer];
  }
};
