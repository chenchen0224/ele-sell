'use strict'
//插件的使用：只需要require()它，然后把它添加到plugins数组中
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path') //path为node.js提供的API，表示一些文件路径
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)


/*mock data*/
const appData = require('../src/mock/data.json');
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings
/*mock data*/

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    /*mock data*/
    before(app) {
      app.get('/api/seller', function(req, res) {
        res.json({
          code: 0,//标识请求返回数据是否正常
          data: seller
        })
      });
      app.get('/api/goods', function(req, res) {
        res.json({
          code: 0,
          data: goods
        })
      });
      app.get('/api/ratings', function(req, res) {
        res.json({
          code: 0,
          data: ratings
        })
      });
    },
    /*mock data*/
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.join(config.dev.assetsPublicPath, 'index.html')
      }, ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port, // 代理端口号
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable, // 代理接口
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [                                        // 一些额外的插件，不是必须的
    new webpack.DefinePlugin({                      // 编译时配置的全局变量
      'process.env': require('../config/dev.env')   //当前环境为开发环境
    }),
    new webpack.HotModuleReplacementPlugin(),       //热更新插件
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),             //不触发错误,即编译后运行的包正常运行，编译出错时跳过那部分代码
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({                     // 以现有html为模板去生成新的html以及相应配置，比如编译后文件的引入
      filename: 'index.html',//生成的文件名
      template: 'index.html',//模板
      inject: true // 表示css、js路径自动添加到该html文件里（css->header标签,js->body），也可配置
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors 
        ? utils.createNotifierCallback() 
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})