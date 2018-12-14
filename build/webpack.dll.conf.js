process.env.NODE_ENV = 'production'
const path = require('path');
const vueLoaderConfig = require('./vue-loader.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const AssetsPlugin = require('assets-webpack-plugin'); // 生成文件名，配合HtmlWebpackPlugin增加打包后dll的缓存
const webpack = require('webpack')
const srcPath = path.join(__dirname, '../static/dll');
const vendors = [

  'vue/dist/vue.esm.js',
  'vue-router',
  'vuex',
  'axios',
  'babel-polyfill',
  'es6-promise',
  'fastclick'

]

const webpackConfig = {
  entry: {
    // 多入口，单入口情况，只需写一个，key值自定义，value值为数组
    vendor: vendors,

  },
  resolve: {
    extensions: ['.js', '.vue', '.json']
  },
  output: {
    path: srcPath,
    filename: "[name].js",
    library: "[name]_library"
  },
  module: {
    loaders: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /muse-ui.src.*?js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader"
        })
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          publicPath: './',
          limit: 1000,
          name: 'fonts/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      // DllPlugin的name属性需要和libary保持一致
      name: '[name]_library',
      path: path.join(__dirname, '../static/dll', '[name]-mainfest.json'),
      // context需要和webpack.config.js保持一致
      context: __dirname,

    }),
    new ExtractTextPlugin({
      filename: '[name].dll.css'
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
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
    new AssetsPlugin({
     filename: 'bundle-config.json',
     path: './static/dll'
   })

  ]
}

module.exports = webpackConfig;
