const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

function setPath(folderName) {
    return path.join(__dirname, folderName);
}

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
    context: setPath('extension'),
    entry: {
        'background': './background/background.js',
/*         'popup/popup': './popup/popup.js',
        'options/option-page': './options/option-page.js',
        './tabpages/manage-groups/manage-groups-controller': './tabpages/manage-groups/manage-groups-controller.js', */
    },
    output: {
        path: setPath('build'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    node: {
        setImmediate: false,
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    devtool: false,
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                    ecma: 8,
                    compress: {
                        drop_console: true,
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: {
                                safe: true,
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                    },
                ]
            },
        ],
    },
    plugins: [

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            // chunkFilename: "[id].css"
        }),

        new CopyWebpackPlugin(
            multipleCopy('_locales', 'manifest.json')
            .concat([
                {from: '**/*.html'},
                {from: '**/*.css'},
            ])
        ),

        new WebpackShellPlugin({
            onBuildEnd: ['node scripts/remove-evals.js'],
        }),
    ],
};

// module.exports = config;
module.exports = function(env, options) {
    let isProduction = options.mode === 'production';

    config.plugins.push(new webpack.DefinePlugin({
        IS_PRODUCTION: isProduction,
    }));

    return config;
};
