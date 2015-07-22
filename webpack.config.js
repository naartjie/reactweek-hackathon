module.exports = {

  devtool: 'source-map',

  entry: './app/App.js',

  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
      {test: /\.cjsx$/, loader: 'coffee-jsx'},
    ]
  },
  resolve: {
    extensions: ["", ".cjsx", ".js"]
  }

};