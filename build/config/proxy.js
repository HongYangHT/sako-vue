/*
 * @Author: sam.hongyang
 * @LastEditors  : sam.hongyang
 * @Description: 代理设置
 * @Date: 2019-12-18 14:25:15
 * @LastEditTime : 2019-12-18 14:25:42
 */
module.exports = {
  proxy: {
    '/api': {
      target: 'http://localhost:9000/'
    }
  }
}
