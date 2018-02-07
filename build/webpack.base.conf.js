
'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}



module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {                   // 1. 入口文件配置
    app: './src/main.js'
  },
  output: {                  // 2. 输出文件配置
    path: config.build.assetsRoot,    // 输出目录的绝对路径
    filename: '[name].js',            // 输出文件的名称，name为对应entry的key
    publicPath: process.env.NODE_ENV === 'production'// 生产模式或开发模式下html、js等文件内部引用的公共路径(请求的静态资源绝对路径)
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },

  resolve: {                //3. 文件解析，相关require/import模块的相关配置
    extensions: ['.js', '.vue', '.json'],//在模块中自动补全文件扩展名
    alias: {//优化路径，缩短路径字符串长度，注意静态资源不能在alias下配置
      'vue$': 'vue/dist/vue.esm.js',
      //'@': resolve('src'),
      //'src': path.resolve(__dirname, '../src'),
      '@common': path.resolve(__dirname, '../src/common'),
      '@components': path.resolve(__dirname, '../src/components')
    }
  },
  //在webpack配置中定义loader时，要定义在module.rules中,
  module: {                 // 4. loader被用于转换不同类型的模块数据
    rules: [
      {
        test: /\.vue$/,           // vue文件后缀
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,            // js文件后缀
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,        // 图片文件后缀
        loader: 'url-loader',
        options: {
          //表示当图片大小小于10kb时，打包到编译后的js文件中，超过10kb的话会单独生成一个文件，name表示生成的规则
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,       // 字体文件后缀
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
