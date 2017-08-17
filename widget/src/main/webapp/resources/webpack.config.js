/*var webpack = require('webpack');*/
/*var $ = require("jquery");*/
var path = require('path');
var webpack = require('webpack');
var DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

module.exports = {
	entry : {
		'entry' : './entry.js'
	},
	output : {
		filename : 'weather_widget_bundle.js'
	},
	module : {
		rules : [
			{
				test : /\.css$/,
				use : [
					'style-loader',
					'css-loader'
				]
			}
		]
	},
	plugins : [
		new webpack.ProvidePlugin({
			$ : 'jquery',
			jQuery : 'jquery'
		}),
		new DuplicatePackageCheckerPlugin(),
		new webpack.optimize.DedupePlugin()
	]
	
//	,
//	externals : {
//		// require("jquery") is external and available
//		//  on the global var jQuery
//		"jquery" : "jQuery"
//	}




	,	
	 devtool: 'inline-source-map',
	    devServer: {
	        historyApiFallback: true,
	        compress: true,
	        publicPath: '/webpack/resources/',
	        host: "0.0.0.0",
	        port: 3000,
	        proxy: {
	            "**": "http://localhost:8080"
	        }
	    },
	    plugins: [
	        new webpack.NamedModulesPlugin() //브라우저에서 HMR 에러발생시 module name 표시
	    ]

};