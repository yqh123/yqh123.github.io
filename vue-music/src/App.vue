<template>
  <div id="app">
  	<m-header></m-header>
  	<tab></tab>
    <transition :name="names" >
      <keep-alive>
        <router-view></router-view>  
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'	// 页面顶部标题
import Tab from 'components/tab/tab'				        // 页面顶部tab切换

export default {
  components:{
  	MHeader,
  	Tab
  },
  data(){
    return {
      names: 'tranLeft'
    }
  },
  watch:{
    $route(to,from){
      if( to.meta.index < from.meta.index ){
        this.names='tranRight';
      }else{
        this.names='tranLeft';
      }
    }
  }
}
</script>

<style>
  .pageBackground{
    background: #222;
  }

  .tranLeft-enter{
    transform: translateX(100%);
  }
  .tranLeft-enter-active,.tranLeft-leave-active{
    transition: 0.5s;
  }
  .tranLeft-enter-to{
    transform: translateX(0);
  }

  .tranLeft-leave{
    transform: translateX(0);
  }
  .tranLeft-leave-to{
    transform: translateX(-100%);
  }

  .tranRight-enter{
    transform: translateX(-100%);
  }
  .tranRight-enter-active,.tranRight-leave-active{
    transition: 0.5s;
  }
  .tranRight-enter-to{
    transform: translateX(0);
  }

  .tranRight-leave{
    transform: translateX(0);
  }
  .tranRight-leave-to{
    transform: translateX(100%);
  }
</style>