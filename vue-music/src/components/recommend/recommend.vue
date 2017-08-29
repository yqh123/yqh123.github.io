<template>
  <div class="recommend pageBackground">
    <!-- <div class="recommend-content">
      <div v-if="recommends.length" class="slider-wrapper">
        <div class="slider-content">
          <slider>
            <div slot="roll" v-for="(item,index) in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li>123</li>
        </ul>
      </div>
    </div> -->
    <swiper auto :list="recommends" :loop="true"></swiper>
    <div class="recommend-content">
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
        <div v-if="discList.length" class="scrollerConter">
          <scroller :on-refresh="_refresh" ref="myRef" refreshText="刷新数据">
            <ul>
              <li class="item" v-for="item in discList">
                <div class="icon">
                  <img v-lazy="item.pic" width="60" height="60">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.title"></h2>
                  <p class="desc">数据丢失......</p>
                </div>
              </li>
            </ul>
          </scroller>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 引人自己在api文件夹里面的封装方法或属性
  import {getRecommend,getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  // 引人轮播图等组件和插件"better-scroll"
  // (https://github.com/ustbhuangyi/better-scroll)
  // import Slider from 'base/slider/slider'

  // 引人vux
  import { ViewBox,Swiper,Toast } from 'vux'

  // 引人scroll组件
  import Scroll from 'base/scroll/scroll'
  var initLoaded = false;

  // 引人loading加载组件
  import Loading from 'base/loading/loading'

  /*export default {
    data(){
      return {
        recommends:[]   // 轮播图数据
      }
    },
    components:{
      Slider
    },
    created(){
      this._getRecommend()
    },
    methods:{
      // 获取recommend页面数据（轮播图、推荐列表）
      _getRecommend(){
        const _this = this;
        getRecommend().then((res)=>{
          if(res.code == ERR_OK){
            _this.recommends = res.data.slider || [];
            console.log(res.data)
          }
        })
      }
    }
  }*/
  export default {
    data(){
      return {
        recommends:[], // 轮播图数据
        discList:[]    // 推荐列表
      }
    },
    components:{
      ViewBox,
      Swiper,
      Scroll,
      Toast,
      Loading
    },
    created(){
      this._getRecommend()
      this._getDiscList()
      initLoaded = true;
    },
    methods:{
      // 获取recommend页面数据（轮播图）
      _getRecommend(){
        const _this = this;
        getRecommend().then((res)=>{
          if(res.code == ERR_OK){
            _this.recommends = res.data.slider.map((item)=>{
              return {
                img:item.picUrl,
                url:item.linkUrl
              }
            })
          }
        })
      },
      // 获取recommend页面数据（推荐列表）
      _getDiscList(){
        const _this = this;
        getDiscList().then((res)=>{
          if(res.code == ERR_OK){
            setTimeout(item=>{
              _this.discList = res.data.focus;
              _this.discList.length = 5;
            },1000)
          }
        })
      },
      _refresh(){    // 下拉刷新
        setTimeout(item=>{
          initLoaded = true;
          this.$refs.myRef.finishPullToRefresh();
          this.$vux.toast.text(`暂无数据更新`, 'center');
        },1000)
      },
      _infinite(){
        setTimeout(item=>{
          console.log('上拉加载')
        },1000)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      .slider-wrapper
        position: relative
        width: 100%
        height: 0
        padding-top: 40%
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
          overflow: hidden
      .recommend-list
        .list-title
          height: 40px
          line-height: 40px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 5px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
            img
              width:60px
              height:40px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 60%
        transform: translateY(-50%)
      
</style>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  .scrollerConter{
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 500px;
  }
  .recommend{
    .name{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>