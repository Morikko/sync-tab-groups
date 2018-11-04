const path = require('path');
const webpack = require('webpack');

const plugins = [
  new webpack.DefinePlugin({
    'process.env.IS_PROD': false,
  }),
];

module.exports = {
  output: {
    path: path.resolve(__dirname, './build'),
  },
  target: 'web',
  mode: 'development',
  plugins,
  devtool: 'source-map',
};