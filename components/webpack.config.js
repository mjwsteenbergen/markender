const path = require('path');
var glob = require("glob");

var files = glob.sync('./dist/esm/*');
files.push("./dist/markender-components/markender-components.css");

module.exports = {
  entry: files,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/dist.all'),
  },
};
