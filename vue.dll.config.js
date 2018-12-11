const path = require('path')
//去console插件
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack')
const srcPath = path.join(__dirname, './public/dll');

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
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
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
      path: path.join(__dirname, './public/dll', '[name]-mainfest.json'),
      // context需要和webpack.config.js保持一致
      context: __dirname,

    }),
    new MiniCssExtractPlugin({
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
    })


  ]
}

module.exports = webpackConfig;
