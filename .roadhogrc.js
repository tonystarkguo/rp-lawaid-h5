const path = require('path')
const pxtorem = require('postcss-pxtorem');

const svgSpriteDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''), // antd-mobile 内置svg
  path.resolve(__dirname, 'src/my-project-svg-foler'),  // 业务代码本地私有 svg 存放目录
]

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  "theme": "./theme.config.js",
  "env": {
      "development": {
        "extraBabelPlugins": [
          "dva-hmr",
          "transform-runtime",
  		    ["import", { "libraryName": "antd-mobile", "style": true }]
        ],
        extraPostCSSPlugins: [
          pxtorem({
            rootValue: 100,
            propWhiteList: [],
          }),
        ]
      },
      "production": {
        "extraBabelPlugins": [
          "transform-runtime",
  		    ["import", { "libraryName": "antd-mobile", "style": true}]
        ],
        extraPostCSSPlugins: [
          pxtorem({
            rootValue: 100,
            propWhiteList: [],
          }),
        ]
      }
  },
  "proxy": {
    /*"/opm": {
      "target": "https://dev-lawaid-opm-api.fabaogd.com",
      "changeOrigin": true,
      "secure": false
      /*,
      "pathRewrite": { "^/api/v1" : "" }
    },*/

    "/rp": {
      "target": "http://120.78.71.239:5002",
      // "target": "http://192.168.26.200:5002",
      "changeOrigin": true,
      "secure": false,
      "pathRewrite": { "^/api/v1" : "" }
    },

    "/oss": {
      "target": "http://120.78.71.239:5002",
      // "target": "http://192.168.26.200:5002",
      "changeOrigin": true,
      "secure": false,
      "pathRewrite": { "^/api/v1" : "" }
    },

    "/upload": {//This is for upload attachments to ali cloud.
      "target": "http://bestone-lawaid-zhj.oss-cn-shenzhen.aliyuncs.com",
      // "target": "http://bestone-lawaid-zhj.oss-cn-hangzhou.aliyuncs.com",
      "changeOrigin": true,
      "secure": false,
      "pathRewrite": {'^/upload' : ''}
    }
  }
}
