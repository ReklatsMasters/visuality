const webpack = require('webpack');
const fs = require('fs');

module.exports = {
	debug: false,
	entry: {
		mixpal: [ './src/mixpal.js' ]
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].user.js'
	},
	module: {
		loaders: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|dist)/,
				loader: 'babel?stage=0'
			}
		]
	},
	plugins: [
		new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: false }),
    new webpack.BannerPlugin(fs.readFileSync('banner.js', 'utf8'), {raw: true})
	]
}
