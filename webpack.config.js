var path = require('path');

module.exports = {
  entry: [
    './app/vendor.ts',
    './app/bootstrapper.ts'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: path.resolve(__dirname, 'app'),
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
  }
};
