const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

module.exports = {
    context: __dirname,
    watch: true,
    //define entry point
    entry: './assets/js/functions.js',
    //define output point
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "jshint-loader"
        }],
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            exclude: /node_modules/,
            //include: path.join(__dirname, 'assets/img'),
            loaders: [
                'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
                'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
        }, {
            test: /\.html$/,
            loader: 'file-loader?name=[name].[ext]!extract-loader!html-loader'
        }, {
            test: /\.sass$/,
            loader: ExtractTextPlugin.extract('css-loader!sass-loader')
        }]
    },
    plugins: [
        new ExtractTextPlugin('base.css')
    ]
}
