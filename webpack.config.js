const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './converter.js',
    output: {
        path : path.join(__dirname, '/'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: /node_modules/, 
                use:{
                    loader: 'babel-loader'
                } 
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './converter.html'
        }
        )
    ]
}
