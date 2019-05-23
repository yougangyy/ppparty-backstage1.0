// import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routers'
import axios from 'axios'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

import * as custom from '@/common/js/timer' // 引入我们刚刚创建的文件

// 全局注册

Object.keys(custom).forEach(key => { Vue.filter(key, custom[key])})

Vue.use(ElementUI)
Vue.use(VueRouter)


Vue.use(Viewer);
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});
//NProgress.configure({ showSpinner: false });
Vue.prototype.$ajax = axios

const router = new VueRouter({
  // mode:"history",
  routes
})

// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   if (to.path == '/login') {
//     sessionStorage.removeItem('user');
//   }
//   let user = JSON.parse(sessionStorage.getItem('user'));
//   if (!user && to.path != '/login') {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
// })

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

