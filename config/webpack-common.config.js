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
    extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
    root: path.resolve(root, 'app'),
    modulesDirectories: ['node_modules']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript',
        exclude: ['/node_modules/', '\.spec\.ts$']
      },
      {
        test: /\.css$/,
        loader: 'raw'
      },
      {
        test: /\.scss$/,
        loader: 'raw!sass!source-map'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'raw'
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: 'url?limit=10000'
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
