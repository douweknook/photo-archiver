var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
module.exports = {
	entry: __dirname + '/frontend/src/js/main.js',
	output: {
		filename: __dirname + '/frontend/static/js/bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		}, {
			test: /\.scss$/,
			loaders: ['style', 'css', 'sass']
		}]
	},
	plugins: [
		new BrowserSyncPlugin( {
			host: 'localhost',
			port: 3000,
			server: { baseDir: ['frontend/static'] }
		} )
	]
}