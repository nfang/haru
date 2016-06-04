module.exports = {
  resolve: {
    extensions: ['', '.ts', '.js']
  },

  devtool: 'inline-source-map',

  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts',
    }, {
      test: /\.css$/,
      loader: 'null'
    }, {
      test: /\.scss$/,
      loader: 'raw!sass'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.html$/,
      loader: 'html'
    }]
  }
};
