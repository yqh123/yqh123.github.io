<template>
  <div id="app">
  	<view-box> 

		<x-header class="xheader"
			title="标题" 
			:left-options="{
				showBack: false,
				backText:'back'
			}"
			:right-options="{
				showMore:true
			}"
		>
			<div slot="left">返回</div>
		</x-header>
		<sc class="xscroller" lock-y :scrollbar-x=false>
			<div style="width: 100%;overflow:scroll;-webkit-overflow-scrolling:touch;">
				<tab>
			      	<tab-item selected>最新</tab-item>
			      	<tab-item>推荐</tab-item>
			      	<tab-item>视频</tab-item>
			      	<tab-item>游戏</tab-item>
			    </tab>
			</div>
		</sc>

		<!--上拉加载-->
		<router-view></router-view>
		<!--下拉刷新-->

		<tabbar slot="bottom">
	      	<tabbar-item>
				<img slot="icon" src="./assets/logo.png">
        		<span slot="label">Wechat</span>
	      	</tabbar-item>
	      	<tabbar-item>
				<img slot="icon" src="./assets/logo.png">
        		<span slot="label">Wechat</span>
	      	</tabbar-item>
	      	<tabbar-item>
				<img slot="icon" src="./assets/logo.png">
        		<span slot="label">Wechat</span>
	      	</tabbar-item>
		</tabbar>

  	</view-box>
  </div>
</template>

<script>
	import { ViewBox,XHeader,Tabbar,TabbarItem,Tab,TabItem,Scroller as sc,Swiper } from 'vux'

	export default {
		name:'app',
		components:{
			ViewBox,
			XHeader,
			Tabbar, 
			TabbarItem,
			Tab, 
			TabItem,
			sc,
			Swiper
		}
	}  
</script>

<style lang="less">
	@import '~vux/src/styles/reset.less';

	html, body {
	    height: 100%;
	    width: 100%;
	    overflow-x: hidden;
	}
	#app{
		height: 100%;
		.xheader{
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			z-index: 100;
		}
		.xscroller{
			margin-top: 46px;
		}
		.loading-layer{
			padding-bottom: 90px;
		}
		._v-container{
			top: 90px !important;		
		}
	}
	
</style>