const path = require('path');

module.exports = {
    target : "node",
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // o/p folder
    filename: 'bundle.js', // o/p file name
  },
  mode : "development"
};