// webpack.config.js
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './auth.js', // Adjust this path to where your script.js is located
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new Dotenv()
  ],
  resolve: {
    fallback: {
      "fs": false,
      "path": false,
    }
  },
  mode: 'development' // Change to 'production' for production builds
};
