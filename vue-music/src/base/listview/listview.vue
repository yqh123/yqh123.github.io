<template>
  <scroll 
    v-if="data.length" 
    class="listview pageBackground" 
    :data="data" 
    ref="listview" 
    :probe-type="probeType"
    :listenScroll="listenScroll"
    @scroll="scroll"
  >
    <ul ref="ullist">
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" 
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li v-for="(item,index) in shortcutList" :dataIndex="index" class="item" :class="{current:currentIndex==index}">{{item}}</li>
      </ul>
    </div>
    <div v-show="fixedTitle" class="list-fixed" ref="fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'     // 引人scroll组件
  import Loading from 'base/loading/loading'  // 引人loading加载组件

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    props:{
      data:{
        type:Array,
        default:[]
      }
    },
    data(){
      return {
        currentIndex:0,
        scrollY:-1,
        diff:-1
      }
    },
    created(){
      this.touch = {},
      this.listHeight = [],
      this.listenScroll = true, // 时刻监听scroll插件的滚动
      this.probeType = 3        // 时刻监听scroll插件的滚动
    },
    components:{
      Scroll,
      Loading
    },
    computed:{
      shortcutList(){
        return this.data.map((item)=>{
          return item.title.substr(0,1)
        })
      },
      fixedTitle(){
        if(this.scrollY>0){
          return ''
        }
        return this.data? this.data[this.currentIndex].title : ''
      }
    },
    watch:{
      data(){
        setTimeout(()=>{
          this._calculateHeight()
        },20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length-1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if ( -newY>=height1 && -newY<height2 ) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight-2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    methods:{
      onShortcutTouchStart(event){    // 点击右侧进行better-scroll描点跳转
        let anchorIndex = event.target.getAttribute('dataIndex')
        this.autoPage(anchorIndex)

        // 记录手指按下时鼠标Y轴数据
        let firstTouch = event.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex

        // 手指触摸时给元素添加active属性
        this.currentIndex = anchorIndex
      },
      onShortcutTouchMove(event){
        // 记录手指move时鼠标Y轴数据
        let firstTouch = event.touches[0]
        this.touch.y2 = firstTouch.pageY
        // 计算偏移距离
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let delta2 = delta + Number(this.touch.anchorIndex)

        let len = this.$refs.ullist.children.length -1
        if(delta2<=0){
          delta2=0
        }
        if(delta2>=len){
          delta2=len
        }
        this.autoPage(delta2)

        // 手指滑动时给元素添加active属性
        this.currentIndex = delta2
      },
      scroll(pos){        // 获取内容区域scroll的y轴滚动距离
        this.scrollY = pos.y
      },
      autoPage(index){
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
      },
      _calculateHeight() {  // 计算每个一个scroll li的内容高度
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectItem(item){     // 点击每个歌手列表，派发事件到自路由(父组件页面)
        this.$emit('select',item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 4px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
