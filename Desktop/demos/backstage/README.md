######
打包时遇见的问题：
路径问题，修改config文件夹里的index.js中的打包后的build配置对象里的assetsPublicPath: './',样式路径要在build文件夹下的utils.js文件里的
if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath:"../../"
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }
  配置publicPath:"../../";

history不支持线上需要配置nginx（服务器配置），如果不配置的话刷新就会导致页面丢失；
