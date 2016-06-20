var path = require('path');
var webpack = require('webpack');
var util = require('./util');
var root = util.root;
var autoprefixer = require('autoprefixer');

/**
 * Plugins
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

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
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url',
      query: {
        limit: 50000,
        mimetype: 'application/font-woff',
        name: './font/[name].[ext]'
      }
    }]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new CopyWebpackPlugin([{
      from: 'app/assets',
      to: 'assets'
    }, {
      from: 'app/humans.txt',
      to: 'humans.txt'
    }, {
      from: 'app/favicon.ico',
      to: 'favicon.ico'
    }]),

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
