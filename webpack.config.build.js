const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


let config = {
  entry: {
    'quill-replaceable-attribute.min.js': ['./src/quill-replaceable-attribute.js', './src/styles.scss']
  },
  output: {
    filename: '[name]',
    library: 'QuillReplaceableAttribute',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    quill: 'Quill',
  },
  plugins: [
    new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['dist']
    }),
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
    }]
  }/*,
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    open: true /*,
    writeToDisk: true
  }*/
};
module.exports = config;