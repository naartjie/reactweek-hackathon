module.exports = {

  devtool: 'source-map',

  entry: './app/App.js',

  output: {
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', exclude: /node_modules/}
    ]
  },

};