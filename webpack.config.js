var uglifyJsPlugin = require("./node_modules/webpack/lib/optimize/UglifyJsPlugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

function rewriteUrl(replacePath) {
    return function(req, opt) {

        var temUrl = ''
        req.originalUrl.replace(/.*a=(.*)&m=(.*)/, function(a, b, c) {

            temUrl = b + '_' + c.split('&')[0];

        })

        req.url = '/mock/' + temUrl + '.json';

        console.log('rewrite', req.originalUrl, '=>', req.url);
    };
}

var config = {
    entry: {
        index: './src/main.js',
        vendors: ['angular-ui-router', 'angular-touch'],
    },
    output: {
        filename: '[hash].build.js'
    },
    devServer: {
        contentBase: './src',
        port: 8888,
        inline: true,
        proxy: [
            {
                path: /app.php.*/,
                target: "http://localhost:8888",
                rewrite: rewriteUrl(),
                changeOrigin: true,
            },
            {
                path: /share.php.*/,
                target: "http://localhost:8888",
                rewrite: rewriteUrl(),
                changeOrigin: true,
            }
        ]
    },

    devtool: 'source-map',

    resolve: {
        // 添加加载文件的后缀
        extensions: ['' ,".html", ".js", ".png", ".jpg", ".less", ".gif"]
    },

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url?limit=3000'

        }, {
            test: /\.html$/,
            loader: 'html-loader'
        }],

    },

    plugins: [
        new ExtractTextPlugin("[hash].[name].css"),

        new HtmlWebpackPlugin({
            title: 'Custom template',
            template: './src/tpl/index.html',
            filename: './index.html',
            inject: 'body',
            // chunks: ['vendors']
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: "vendors",
            filename: "vendors.js"
        }),

         new webpack.DefinePlugin({
            
            TEST: process.env.TEST ? true: false,
            RELEASE:process.env.RELEASE ? true: false
        })
    ]
}

if ("test,release".indexOf(process.env.NODE_ENV) > -1) {
    config.plugins.push(new uglifyJsPlugin({
        compress: {
            warnings: false
        }

    }))
}

if (process.env.NODE_ENV === 'dev') {

    config.plugins.push(new openBrowserWebpackPlugin({ url: 'http://localhost:8888' }))
}




module.exports = config;
