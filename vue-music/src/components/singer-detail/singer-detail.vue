<template>
  <transition name="slide" mode="out-in">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex' // 引人vuex提供的语法糖去获取数据
  import Scroll from 'base/scroll/scroll' // 引人scroll组件
  // 引人自己在api文件夹里面的封装方法或属性
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'

  import {createSong} from 'common/js/song'

  import MusicList from 'components/music-list/music-list'

  export default {
    data(){
      return {
        songs:[]
      }
    },
    components:{
      MusicList
    },
    computed:{
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      ...mapGetters([
          'singer'
        ])
    },
    created(){
      this._getDetail()
    },
    methods:{
      _getDetail(){
        const _this = this;
        if(!this.singer.id){
          this.$router.push('/singer')
          return 
        }
        getSingerDetail(this.singer.id).then((res)=>{
          if(res.code == ERR_OK){
            _this.songs = _this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  
  .singer-detail
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 100
    background: #222
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>