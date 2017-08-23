import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'

const debug = process.env.NODE_ENV !== 'production'

// recommend页面头部轮播图数据
export function getRecommend(){
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
	const data = Object.assign({},commonParams,{
		platform: 'h5',
	    uin: 0,
	    needNewCode: 1
	})
	return jsonp(url,data,options)
}

// recommend页面推荐列表数据
export function getDiscList(){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_first_yqq.fcg'
	const data = Object.assign({},commonParams,{
		platform:'yqq',
		rnd:Math.random(),
		hostUin:0,
		tpl:'v12',
		page:'other',
		needNewCode:0
	})
	return jsonp(url,data,options)
}

//禁止浏览器下拉回弹 需要引人jq后才能使用
export function stopDrop(){
  var lastY;
  $(document).on('touchstart', function(event) {
      lastY = event.originalEvent.changedTouches[0].clientY;
  });
  $(document).on('touchmove', function(event) {
      var y = event.originalEvent.changedTouches[0].clientY;
      var st = $(this).scrollTop(); 
      if (y >= lastY && st <= 10) {
          lastY = y;
          event.preventDefault();
      }
      lastY = y;
  });
}
