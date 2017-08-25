import 'babel-polyfill'				// 解决ES6问题(要安装)
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'			// 引入store接口(Vuex)
import fastclick from 'fastclick'	// 解决移动端点击300ms延时(要安装)
import '@/common/stylus/index.styl'	//引人stylus里面的styl样式文件(先安装stylus-loader)	
           

/*引人jsonp插件*/
import VueResource from 'vue-resource'
Vue.use(VueResource)

/*引人VueScroller插件*/
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)

/*引人Toast弹窗提示插件*/
import { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)

/*引人图片懒加载 (http://www.8dou5che.com/2017/05/11/vue-lazyload/) 只需将img的src或:src改成v-lazy*/
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, { 
	error: require('common/image/default.png'),
  	loading: require('common/image/default.png')
})

/*解决移动端点击300ms延时(要安装)*/
fastclick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
