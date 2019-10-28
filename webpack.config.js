const path = require('path');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


let config = {
  entry: './src/quill-replaceable-attribute.js',
  output: {
    filename: 'quill-replaceable-attribute.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // new CleanWebpackPlugin({
    //     cleanAfterEveryBuildPatterns: ['dist']
    // }),
    new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: false,
        inject: 'head'
    }),
    new MiniCssExtractPlugin({
        filename: 'styles.css'
    })
  ],
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
    }, {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',//production   MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    open: true /*,
    writeToDisk: true*/
  }
};
module.exports = config;