const path = require('path')

module.exports = {
  entry: "./src/main.js",
  mode: 'development',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "bundle.js",
    library: 'epoxy',
    libraryTarget: 'umd',
    filename: 'epoxy.js',
  },
  module: {
    rules: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
