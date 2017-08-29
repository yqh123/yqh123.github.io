import Vue from 'vue'
import App from './App'
import router from './router'
import VueJsonp from 'vue-jsonp'
import VueScroller from 'vue-scroller'
import  { ToastPlugin } from 'vux'

Vue.use(VueJsonp)
Vue.use(VueScroller)
Vue.use(ToastPlugin)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
