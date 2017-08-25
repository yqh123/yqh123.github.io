import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'

// singer页面歌手列表数据
export function getSingerList(){
	const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
	const data = Object.assign({},commonParams,{
		platform:'yqq',
		pagesize:100,
		pagenum:1,
		g_tk:5381,
		channel:'singer',
		page:'list',
		key:'all_all_all',
		hostUin:0,
		needNewCode:0
	})
	return jsonp(url,data,options)
}

// singer页面歌手详情列表数据
export function getSingerDetail(singerId){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
	const data = Object.assign({},commonParams,{
		platform:'yqq',
		pagesize:100,
		pagenum:1,
		g_tk:5381,
		inCharset:'utf8',
		channel:'singer',
		page:'list',
		singermid:singerId,
		order:'listen',
		key:'all_all_all',
		hostUin:0,
		needNewCode:0,
		begin:0,
		num:100,
		songstatus:1
	})
	return jsonp(url,data,options)
}