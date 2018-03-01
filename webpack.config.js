const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Excel to Echart',
			template: './src/index.html',
		})
	],
	devServer: {
		contentBase: './dist/'
	},
	module: {
		loaders: [{
			test: /\.js?$/,
			loaders: ['babel-loader']
		}]
	}
}