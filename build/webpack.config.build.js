/*
 * @Author: sam.hongyang
 * @LastEditors  : sam.hongyang
 * @Description: 生产环境设置
 * @Date: 2019-12-19 14:54:12
 * @LastEditTime : 2019-12-20 15:00:15
 */
const merge = require('webpack-merge')
const base = require('./webpack.config')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const TerserJSPlugin = require('terser-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const path = require('path')

module.exports = smp.wrap(
  merge(base, {
    output: {
      path: path.resolve(__dirname, '../dist/asset'),
      publicPath: '/assets/',
      libraryTarget: 'umd',
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[name].[chunkhash].js',
      umdNamedDefine: true
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          common: {
            test: module => {
              return (
                /[\\/]node_modules[\\/]/.test(module.context) &&
                !/react|redux|prop-types/.test(module.context) &&
                !/vue|vuex|vue-router/.test(module.context)
              )
            },
            name: 'common',
            chunks: 'initial',
            priority: 2,
            minChunks: 3
          },
          vueBase: {
            name: 'vueBase',
            test: module => {
              return /vue|vuex|vue-router/.test(module.context)
            },
            chunks: 'initial',
            priority: 12
          },
          chunkCommon: {
            name: 'chunk-common',
            chunks: 'async',
            priority: 10,
            minChunks: 3 // 最小共用次数
          },
          componentCommon: {
            name: 'component-commons',
            test: path.resolve(__dirname, '../src/components'), // 可自定义拓展你的规则
            minChunks: 2, // 最小共用次数
            priority: 5,
            reuseExistingChunk: true
          },
          commonStyle: {
            name: 'commonStyle',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
            priority: 20
          }
        }
      },
      runtimeChunk: {
        name: 'manifest'
      },
      minimizer: [
        new TerserJSPlugin({}),
        new OptimizeCSSAssetsPlugin({}), // 压缩css
        new UglifyJsPlugin({
          // 有很多可以配置
          cache: true,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            // 在UglifyJs删除没有用到的代码时不输出警告
            warnings: false,
            output: {
              // 删除所有的注释
              comments: false,
              // 最紧凑的输出
              beautify: false
            },
            compress: {
              // 删除所有的 `console` 语句
              // 还可以兼容ie浏览器
              drop_console: true,
              // 内嵌定义了但是只用到一次的变量
              collapse_vars: true,
              // 提取出出现多次但是没有定义成变量去引用的静态值
              reduce_vars: true
            }
          }
        })
      ]
    },
  })
)
