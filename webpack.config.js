
const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package');

module.exports = {
  entry: './src/index',
  output: {
    path: path.resolve('dist'),
    filename: 'index.umd.js',
    libraryTarget: 'umd',
    library: 'AwaitTimeout',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['add-module-exports']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(`${packageJson.name} v${packageJson.version}`)
  ]
};
