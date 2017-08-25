<template>
  <div class="singer pageBackground">
    <list-view :data="singerList" @select="selectSinger"></list-view>
    <!--子路由：singer-detail-->
    <router-view></router-view>
  </div>
</template>

<script>
	import ListView from 'base/listview/listview'
	import {getSingerList} from 'api/singer'
	import Singer from 'common/js/singer'
  	import {ERR_OK} from 'api/config'
  	import {mapMutations} from 'vuex'	// 引人vuex提供的语法糖去写入数据


  	const HOT_NAME = '热门';
  	const HOT_SINGER = 10;

	export default {
		data(){
			return {
				singerList:[]
			}
		},
		components:{
			ListView
		},
		created(){
			this._getSingerList()
		},
		methods:{
			_getSingerList(){
				const _this = this;
		        getSingerList().then((res)=>{
		        	if(res.code == ERR_OK){
		        		_this.singerList = this._normalizeSinger(res.data.list)
		        	}
		        })
			},
			_normalizeSinger(list){
				const _this = this;
				// 热门数据筛选、按分类筛选数据
				let map = {
					hot:{		
						title:HOT_NAME,
						items:[]
					}
				}
				list.forEach((item,index)=>{
					// 这是热门数据
					if(index<HOT_SINGER){
						map.hot.items.push({
							id:item.Fsinger_mid,
							name:item.Fsinger_name,
							avatar:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
						})
						/*map.hot.items.push(new Singer({
							id:item.Fsinger_mid,
							name:item.Fsinger_name
						}))*/
					}
					// 按分类筛选数据
					const key = item.Findex;
					if(!map[key]){
						map[key]={
							title:key,
							items:[]
						}
					}
					map[key].items.push({
						id:item.Fsinger_mid,
						name:item.Fsinger_name,
						avatar:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
					})
					/*map[key].items.push(new Singer({
						id:item.Fsinger_mid,
						name:item.Fsinger_name
					}))*/
				})

				// 为了得到有序列表，我们需要处理map数据
		        let ret = []
		        let hot = []
		        for (let key in map) {
			        let val = map[key]
			        if (val.title.match(/[a-zA-Z]/)) {
			            ret.push(val)
			        } else if (val.title === HOT_NAME) {
			            hot.push(val)
			        }
		        }
		        ret.sort((a, b) => {
		          	return a.title.charCodeAt(0) - b.title.charCodeAt(0)
		        })
		        return hot.concat(ret)
			},
			selectSinger(item){
				this.$router.push({
					path:`/singer/${item.id}`
				})
				this.setSinger(item)
			},
			...mapMutations({
				setSinger:'SET_SINGER'
			})
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
