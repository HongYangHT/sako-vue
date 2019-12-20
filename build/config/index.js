/*
 * @Author: sam.hongyang
 * @LastEditors  : sam.hongyang
 * @Description: 抛出配置选项
 * @Date: 2019-12-18 11:43:32
 * @LastEditTime : 2019-12-18 14:25:02
 */
const proxy = require('./proxy')
module.exports = {
  ...proxy,
  port: 8000,
  // host: '0.0.0.0'
  host: 'localhost'
}
