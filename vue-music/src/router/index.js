import Vue from 'vue'
import Router from 'vue-router'

/*引人头部路由切换页面*/
import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savePosition) { // 记录每个路由页面的滚动位置
    if (savePosition) {       
      return savePosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
  	{
  		path:'/',
  		redirect: '/recommend'
  	},
  	{
  		path:'/recommend',
  		name:'Recommend',
      meta:{ index:1 },
  		component:Recommend
  	},
  	{
  		path:'/singer',
  		name:'Singer',
      meta:{ index:2 },
  		component:Singer,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
  	},
  	{
  		path:'/rank',
  		name:'Rank',
       meta:{ index:3 },
  		component:Rank
  	},
  	{
  		path:'/search',
  		name:'Search',
       meta:{ index:4 },
  		component:Search
  	}
  ]
})


