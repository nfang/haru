var path    = require('path');
var util    = require('./util');
var root    = util.root;

module.exports = {
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: path.resolve(root, 'app'),
    modulesDirectories: ['node_modules']
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript',
        exclude: '/node_modules/',
        query: {
          'compilerOptions': {
            'removeComments': true
          }
        },
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

  plugins: [ ],

  node: {
    global: 'window',
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
