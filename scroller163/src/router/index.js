import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import home from '@/components/home'

export default new Router({
	mode:'history',
  	routes: [
	    {
	      	path: '/',
	      	name:'Home',
	      	component: home
	    }
  	]
})