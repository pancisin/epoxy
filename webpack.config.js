module.exports = {
  entry: "./src/main.js",
  mode: 'development',
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    rules: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
