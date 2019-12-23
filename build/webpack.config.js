/*
 * @Author: sam.hongyang
 * @LastEditors  : sam.hongyang
 * @Description: 公共的webpack设置
 * @Date: 2019-12-19 14:26:12
 * @LastEditTime : 2019-12-20 15:53:26
 */
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueConfig = require('./utils/vue')
const tsConfig = require('./utils/ts')
const saasConfig = require('./utils/saas')
const assetConfig = require('./utils/asset')
const esConfig = require('./utils/es')
const lessConfig = require('./utils/less')

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const CompressionWebpackPlugin = require('compression-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

// const NyanProgressPlugin = require('nyan-progress-webpack-plugin')

const path = require('path')

const pkg = require('../package.json')

const mode = process.env.NODE_ENV !== 'production'
const banner = `
  ${pkg.name}
  ${pkg.description}\n
  @version v${pkg.version}
  @homepage ${pkg.homepage}
  @repository ${pkg.repository.url}\n
  (c) 2019 sam.hongyang
  Released under the MIT License.
  hash: [hash]
`

const plugins = mode ? [
  new webpack.NamedModulesPlugin(),
  new webpack.HashedModuleIdsPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  // new NyanProgressPlugin({
  //   // 获取进度的时间间隔，默认 180 ms
  //   debounceInterval: 60,
  //   nyanCatSays (progress, messages) {
  //     if (progress === 1) {
  //       // 当构建完成时，喊出「呦，又在写 Bug 了？」
  //       return '呦, 又在写 Bug 了'
  //     }
  //   }
  // })
] : [
  new webpack.BannerPlugin(banner),
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*'],
    verbose: true,
    dry: false
  }),
  new OptimizeCSSAssetsPlugin({
    assetNameRegExp: /\.css\.*(?!.*map)/g,
    cssProcessor: require('cssnano'), // 引入cssnano配置压缩选项
    cssProcessorOptions: {
      map: {
        // 不生成内联映射,这样配置就会生成一个source-map文件
        inline: false,
        // 向css文件添加source-map路径注释
        // 如果没有此项压缩后的css会去除source-map路径注释
        annotation: true
      },
      discardComments: { removeAll: true },
      // 避免 cssnano 重新计算 z-index
      safe: true,
      // cssnano 集成了autoprefixer的功能
      // 会使用到autoprefixer进行无关前缀的清理
      // 关闭autoprefixer功能
      // 使用postcss的autoprefixer功能
      autoprefixer: false
    },
    canPrint: true // 是否将插件信息打印到控制台
  }),
  new MiniCssExtractPlugin({
    filename: mode ? 'css/[name].css' : 'css/[name].[contenthash].css',
    chunkFilename: mode ? 'css/[id].css' : 'css/[id].[contenthash].css'
  }),
  new CompressionWebpackPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    // NOTE: 设置生成`gzip`文件大小 100K
    threshold: 100 * 1024,
    minRatio: 0.8,
    cache: true
  }),
  new SWPrecacheWebpackPlugin({
    cacheId: `${pkg.name}`,
    // By default, a cache-busting query parameter is appended to requests
    // used to populate the caches, to ensure the responses are fresh.
    // If a URL is already hashed by Webpack, then there is no concern
    // about it being stale, and the cache-busting can be skipped.
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    // dontCacheBustUrlsMatching: false,
    filename: 'service-worker.js',
    logger(message) {
      if (message.indexOf('Total precache size is') === 0) {
        // This message occurs for every build and is a bit too noisy.
        return
      }
      console.log(message)
    },
    minify: false,
    mergeStaticsConfig: true,
    staticFileGlobs: [],
    // For unknown URLs, fallback to the index page
    navigateFallback: '/index.html',
    // Ignores URLs starting from /__ (useful for Firebase):
    // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
    navigateFallbackWhitelist: [/^(?!\/__).*/],
    // Don't precache sourcemaps (they're large) and build asset manifest:
    staticFileGlobsIgnorePatterns: [/\.html/, /\.map$/, /assets-manifest\.json$/],
    // Work around Windows path issue in SWPrecacheWebpackPlugin:
    // https://github.com/facebookincubator/create-react-app/issues/2235
    stripPrefix: '/assets'.replace(/\\/g, '/') + '/'
  }),
]

module.exports = {
  mode: mode ? 'development' : 'production',
  devtool: mode ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
  // context是webpack编译时的基础目录，entry会相对此目录查找
  // path.join连接路径，将几个路径拼接到一起
  // process.cwd()是当前执行node命令的地址  __dirname是当前模块的目录
  // context: path.join(process.cwd(), 'src'),
  entry: {
    app: './src/index.js'
  },
  module: {
    // // 忽略构建时，webpack解析相关的库
    // noParse: function(lib) {
    // 	return /vue|vuex|vue-router|vue-i18n/.test(lib)
    // },
    rules: [
      ...vueConfig,
      ...tsConfig,
      ...esConfig,
      ...lessConfig,
      ...saasConfig,
      ...assetConfig,
      {
        enforce: 'pre',
        test: /\.(js|vue|jsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src/**'),
        loader: 'eslint-loader',
        options: {
          fix: true,
          formatter: require('eslint-friendly-formatter')
        }
      }
    ]
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '../src')],
    extensions: ['.ts', '.js', '.vue', '.jsx', '.json', '.css', '.scss', '.sass', '.less'],
    alias: {
      '@': path.join(__dirname, '../src'),
      vue: mode ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.min.js',
    }
  },
  plugins: [
    ...plugins,
    // 请确保引入这个插件！
    new VueLoaderPlugin(),
    // 处理html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      filename: path.resolve(__dirname, '../dist/index.html'),
      favicon: path.resolve(__dirname, '../src/assets/ico/favicon.ico'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new CopyPlugin([
      {
        from: 'static/**/*',
        to: './'
      }
    ]),
    new StyleLintPlugin({
      files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}']
    })
  ],
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
