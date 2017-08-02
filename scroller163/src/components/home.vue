<template>
<div>
  	<scroller :on-refresh="refresh" :on-infinite="infinite" ref="myRef" refreshText="刷新数据">
	  	<swiper auto
			:list="swiperList"
			:loop="true"
		>
	    </swiper>
	    <marquee :interval="3000">
	      	<marquee-item v-for="(item,index) in news" :key="index" class="align-middle"><a :href="item.url">{{item.title}}</a></marquee-item>
	    </marquee>
	    <!--下拉刷新数据-->
	    <panel class="panel" :list="datalList"></panel>
	    <!--上拉加载数据-->
	    <panel class="panel" :list="moreDataList"></panel>
	</scroller>
</div>
</template>

<script>
	import { Scroller as scc,Swiper,Marquee,MarqueeItem,Panel } from 'vux'

	var start = 0;
	var end = start+9;
	var initLoaded = false;	// 初始化数据是否加载完成
	export default {
		components:{
			scc,
			Swiper,
			Marquee, 
			MarqueeItem,
			Panel
		},
		data(){
			return {
				swiperList:[],
				news:[],
				datalList:[],
				moreDataList:[],	// 存储上拉加载得到的数据
				key:0,				// 存储下拉刷新
				refreshKey:['A','B01','B02','B03','B04','B05','B06','B07','B08','B09','B010'],	// 存储下拉刷新
				keyList:0,			// 存储上拉加载
				refreshKeyList:['A','B01','B02','B03','B04','B05','B06','B07','B08','B09','B010']	// 存储上拉加载
			}
		},
		created(){
			this.$jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html')
			.then( data=>{
				// 幻灯片数据
				this.swiperList = data.focus.filter( item=>{
					return item.addata === null;
				} ).map( item=>{
					return {
						url:item.link,
						img:item.picInfo[0].url,
						title:item.title
					}
				} )

				// 滚动新闻列表
				this.news = data.live.filter( item=>{
					return item.addata === null;
				} ).map( item=>{
					return {
						url:item.link,
						title:item.title
					}
				} )

				// 首屏列表数据
				this.datalList = data.list.filter( item=>{
					return item.addata === null;
				} ).map( item=>{
					return {
						src:item.picInfo[0].url,
						title:item.source,
						desc:item.title,
						url:item.link
					}
				} )

				initLoaded = true;
			} )
		},
		methods:{
			refresh(){		// 下拉刷新
				setTimeout(item=>{
					this.key++;
					if(this.key>this.refreshKey.length){
						this.key = 0;
					}
					this.$jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html',{
						miss:'00',
						refresh:this.refreshKey[this.key]
					})
					.then( data=>{
						this.datalList = data.list.filter( item=>{
							return item.addata === null && item.picInfo[0];
						} ).map( item=>{
							return {
								src:item.picInfo[0].url,
								title:item.source,
								desc:item.title,
								url:item.link
							}
						} )
						// this.$refs.myRef获取插件scroller的实例对象
						var dataLength = this.datalList.length;
						this.$refs.myRef.finishPullToRefresh();
						this.$vux.toast.text(`共加载了${dataLength}条数据`, 'top');
					})
				},1000)
			},
			infinite(){		// 上拉加载
				if(!initLoaded){
					this.$refs.myRef.finishInfinite();
					return;
				}
				setTimeout(item=>{
					this.keyList++;
					if(this.keyList>=this.refreshKeyList.length){
						this.keyList = 0;
					}
					this.$jsonp(`http://3g.163.com/touch/jsonp/sy/recommend/${start}-${end}.html`,{
						miss:'00',
						refresh:this.refreshKeyList[this.keyList]
					})
					.then( data=>{
						// 首屏列表数据
						var dataS = data.list.filter( item=>{
							return item.addata === null && item.picInfo[0];
						} ).map( item=>{
							return {
								src:item.picInfo[0].url,
								title:item.source,
								desc:item.title,
								url:item.link
							}
						} )
						this.moreDataList = this.moreDataList.concat(dataS);

						start+=10;
						end = start+9;
						this.$refs.myRef.finishInfinite();
						// this.$refs.myRef获取插件scroller的实例对象
						var dataLength = this.moreDataList.length;
						this.$refs.myRef.finishPullToRefresh();
						this.$vux.toast.text(`共加载了${dataLength}条数据`, 'bottom');
					})
				},1000)
			}
		}
	}  
</script>

<style lang="less">
	.align-middle {
		@h:40px;
		height: @h;
		padding-left: 12px;
		font-size: 16px;
		line-height: @h;
	}
	.weui-media-box__hd{
		width:100px !important;
		height:78px;
		margin-top: 0 !important;
		img{
			height:100%;
		}
	}
</style>