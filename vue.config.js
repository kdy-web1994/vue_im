const path = require('path')
//去console插件
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const webpack = require('webpack');
function resolve(dir) {
	return path.join(__dirname, dir)
}

function resolveLocal(...args) {
	return path.join(__dirname, '../../', ...args)
}

function getAssetPath (options, filePath, placeAtRootIfRelative) {
	return options.assetsDir
	  ? path.posix.join(options.assetsDir, filePath)
	  : filePath
  }


    



module.exports = {
	/** 区分打包环境与开发环境
	 * process.env.NODE_ENV==='production'  (打包环境)
	 * process.env.NODE_ENV==='development' (开发环境)
	 * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
	 */
	// 基本路径
	baseUrl: './',
	// 输出文件目录
	outputDir: 'dist',
	// eslint-loader 是否在保存的时候检查
	lintOnSave: false,
	runtimeCompiler:true,
	// use the full build with in-browser compiler?
	// https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
	// compiler: true,
	// webpack配置
	// see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
	chainWebpack: (webpackConfig) => {
		const babelOptions = {
			presets: [require.resolve('@vue/babel-preset-app')]
		}
		if(process.env.NODE_ENV === 'production') {
			webpackConfig
				.optimization.splitChunks({
					cacheGroups: {
						vendors: {
							name: `chunk-vendors`,
							test: /[\\/]node_modules[\\/]/,
							priority: -10,
							chunks: 'initial'
						},
						common: {
							name: `chunk-common`,
							minChunks: 2,
							priority: -20,
							chunks: 'initial',
							reuseExistingChunk: true
						}
					}
				})

//			webpackConfig
//				.optimization.ModuleConcatenationPlugin()

		}
		webpackConfig.resolve
		    .extensions
             .merge(['.js', '.vue', '.json'])
             .end()
			.alias
			 .set('@', resolve('src'))
			 .set('~', resolve('src/assets'))
			 .set('vue$', 'vue/dist/vue.esm.js')
			 .end()
		
	    webpackConfig.resolveLoader
			 .modules
			   .add('node_modules')
			   .add(resolve('node_modules'))
			   .add(resolveLocal('node_modules'))
			   .end()
			   
		webpackConfig.module
			 .rule('js')
			 .test(/\.js$/)
			.include
			 .add([resolve('src'), resolve('test')])
			 .end()
			.exclude
			 .add(/node_modules/)
			 .add(/@vue\/cli-service/)
			 .end()

		webpackConfig.module
				 .rule('vue')
				 .test(/\.vue$/)
				.include
				 .add(resolve('src'))
				 .end()
				.exclude
				 .add(/node_modules/)
                 .end()
				 .use('vue-loader')
                 .loader('vue-loader')
                 .tap(options => {
                 // 修改它的选项...
                 return options
				 }) 

		webpackConfig.module
				 .rule('vue')
				 .test(/\.vue$/)
				.include
				 .add(resolve('src'))
				 .end()
				.exclude
				 .add(/node_modules/)
                 .end()
				 .use('vue-loader')
                 .loader('vue-loader')
                 .tap(options => {
                 // 修改它的选项...
                 return options
				 }) 

		webpackConfig.module
				 .rule('images')
				  .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
				   .use('url-loader')
					 .loader('url-loader')
					 .tap(options => Object.assign(options, { limit: 10240 }))
		             .end()
		
		webpackConfig.module
				 .rule('svg')
				  .test(/\.(svg)(\?.*)?$/)
				   .use('file-loader')
					 .loader('file-loader')
					 .tap(options => Object.assign(options, { limit: 10240 }))
					 .end()
					 
		webpackConfig.module
				 .rule('media')
				  .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
				   .use('url-loader')
					 .loader('url-loader')
					 .tap(options => Object.assign(options, { limit: 10240 }))
					 .end()

		webpackConfig.module
					 .rule('fonts')
					  .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
					   .use('url-loader')
						 .loader('url-loader')
						 .tap(options => Object.assign(options, { limit: 10240 }))
						 .end()

		

	},
	//如果想要引入babel-polyfill可以这样写
	configureWebpack: (config) => {
		config.entry = {
			app: ["babel-polyfill", "./src/main.js"] //最新的入口
		}
//		config.devtool = 'eval'
		// config.resolve = {
		// 	extensions: ['.js', '.vue', '.json'],
		// 	modules: ['./src/components', 'node_modules']
			

		// }


		let plugins = [
			new ParallelUglifyPlugin({
			cacheDir: '.cache/',
			uglifyJS: {
				output: {
					comments: false
				},
				compress: {
					warnings: false
				}
			}
		    }),
				new webpack.DllReferencePlugin({
		      context: __dirname,
		      // manifest就是我们第一步中打包出来的json文件
		      manifest: require('./public/dll/vendor-mainfest.json'),
		    })
		]
		if(process.env.NODE_ENV !== 'development') {
			config.plugins = [...config.plugins, ...plugins]
		}

	},
	crossorigin:"anonymous",
	// vue-loader 配置项
	// https://vue-loader.vuejs.org/en/options.html
	// vueLoader: {},
	// 生产环境是否生成 sourceMap 文件
	productionSourceMap: false,
	integrity: false,
	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: true,
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {
			css: {
        // 这里的选项会传递给 css-loader
      },
      postcss: {

			},

        // 这里的选项会传递给 postcss-loader

		},
		// 启用 CSS modules for all css / pre-processor files.
		modules: false
	},
	// use thread-loader for babel & TS in production build
	// enabled by default if the machine has more than 1 cores
	parallel: require('os').cpus().length > 1,
	// 是否启用dll
	// See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
	//	 dll: true,
	// PWA 插件相关配置
	// see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
	pwa: {
		name: 'My App',
		themeColor: '#4DBA87',
		msTileColor: '#000000',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black',

		// 配置 workbox 插件
		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			// swSrc 中 InjectManifest 模式下是必填的。
			swSrc: 'src/registerServiceWorker.js',
			// ...其它 Workbox 选项...
		}
	},
	// webpack-dev-server 相关配置
	devServer: {
		open: process.platform === 'darwin',
		host: '0.0.0.0',
		port: 8080,
		https: false,
		hotOnly: false,
		proxy: {
			'/api': {
				target: 'http://java1.d.aiitec.org/GaitQianhe/api/',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/'
				}
			}

		}, // 设置代理
		before: app => {}
	},
	// 第三方插件配置
	pluginOptions: {
		// ...
	}
}
