module.exports = {
    context: __dirname,
    //define entry point
    entry: './assets/js/functions.js',
    //define output point
    output: {
        path: 'dist',
        filename: 'bundle.js',
        publicPath: 'dist/'
    },

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.css$/,
            exclude: /(node_modules)/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            exclude: /(node_modules)/,
            loaders: [
                'file?hash=sha512&digest=hex&name=[hash].[ext]',
                'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
        }]
    }
}
