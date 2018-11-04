const path = require('path');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

const plugins = [
  new webpack.DefinePlugin({
    'process.env.IS_PROD': true,
  }),
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
  devtool: 'source-map',
};