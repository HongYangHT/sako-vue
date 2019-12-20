/*
 * @Author: sam.hongyang
 * @LastEditors  : sam.hongyang
 * @Description: ts 设置
 * @Date: 2019-12-19 14:16:15
 * @LastEditTime : 2019-12-19 14:16:29
 */
const { resolve } = require('path')
module.exports = [
  {
    test: /\.ts$/,
    loader: 'ts-loader',
    exclude: file => /node_modules/.test(file) && !/\.js\.ts/.test(file),
    include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
    options: { appendTsSuffixTo: [/\.vue$/] }
  }
]
