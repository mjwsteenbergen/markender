module.exports = {
  // change to .tsx if necessary
  entry: './dest/script/*.js',
  output: {
    filename: './dist/bundle.js'
  },
  resolve: {
    // changed from extensions: [".js", ".jsx"]
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' } },
      { test: /\.(t|j)s?$/, use: { loader: 'awesome-typescript-loader' } },
      // addition - add source-map support 
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  // addition - add source-map support
  devtool: "source-map"
}