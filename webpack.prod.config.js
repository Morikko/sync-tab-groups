const path = require('path');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const plugins = [
  new webpack.DefinePlugin({
    'process.env.IS_PROD': true,
  }),
  new CopyWebpackPlugin([
    {
      from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
      to: 'lib/browser-polyfill.js',
      context: '../',
      flatten: true,
    },
  ]),
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: cssnano,
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint: true,
  }),
];

module.exports = {
  output: {
    path: path.resolve(__dirname, './release/build'),
  },
  target: 'web',
  mode: 'production',
  plugins,
  // Prefer size and performance
  devtool: 'none',
};