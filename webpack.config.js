const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const devConfig = require('./webpack.dev.config');
const prodConfig = require('./webpack.prod.config');

function copy(path) {
  return {
    from: path,
    to: path,
  };
}

function multipleCopy(...paths) {
  return paths.map(copy);
}

const config = {
  context: path.resolve(__dirname, './extension'),
  entry: {
    'background': './background/background.js',
    'popup/popup': './popup/popup.js',
    'options/option-page': './options/option-page.js',
    './manage/manage-groups': './manage/manage-groups-controller.jsx',
    './tabpages/lazytab/lazytab': './tabpages/lazytab/lazytab.js',
    './tabpages/privileged-tab/privileged-tab': './tabpages/privileged-tab/privileged-tab.jsx',
    './tabpages/selector-groups/selector-groups-controller': './tabpages/selector-groups/selector-groups-controller.jsx',
    './tabpages/shortcut-help/shortcut-help': './tabpages/shortcut-help/shortcut-help.jsx',
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].map.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          ecma: 8,
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin(
      multipleCopy('_locales', 'manifest.json', 'lib')
        .concat([
          {from: '**/*.html'},
          {from: '**/*.css'},
          {from: '**/*.png'},
        ])
    ),

    /* new WebpackShellPlugin({
      onBuildEnd: ['node scripts/remove-evals.js'],
    }), */
  ],
};

module.exports = (env, argv) => {
  let envConfig;

  if (argv.mode === 'development') {
    envConfig = devConfig;
  }

  if (argv.mode === 'production') {
    envConfig = prodConfig;
  }

  return merge(config, envConfig);
};