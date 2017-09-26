var weddingExpoFile = {};

$(function(){
	weddingExpoFile.publicHeader();			// 公共顶部导航鼠标移入移出效果
	weddingExpoFile.publicPreface();		// 公共侧边栏js效果		
	weddingExpoFile.rillScrollBar();		// 自定义滚动条	
	weddingExpoFile.flexslider();			// 轮播图
	weddingExpoFile.imgCover($("img"),$(".img-cover span"),$(".img-cover"));  //放大单独显示图片
});

// 公共顶部导航鼠标移入移出效果
weddingExpoFile.publicHeader = function(){
	$('.weddingExpoFile-public-header a').mouseenter(function(event) {
		$(this).addClass('active')
	});
	$('.weddingExpoFile-public-header a').mouseleave(function(event) {
		$(this).removeClass('active')
	});
};

// 公共侧边栏js效果
weddingExpoFile.publicPreface = function(){
	if( !$('.js-page-wrap').length ) return;
	var numTop = $('.weddingExpoFile-public-header').outerHeight() + $('.weddingExpoFile-public-info').outerHeight();
	var numLeft = $('.js-page-wrap').offset().left;

	// 滚动条滚动时
	$(window).scroll(function(event){
		var T = $(window).scrollTop();
		// 让侧边栏在滚动到指定区域时变成fixed定位
		if( T >= numTop ){
			$('.js-page-wrap').css({
				'position':'fixed',
				'top':40,
				'left':numLeft
			})
		}else{
			$('.js-page-wrap').css({
				'position':'static'
			})
		};

		// 给侧边栏添加指定class
		crearFn(addClas)
	});

	// 可视区域变化时 刷新页面
	$(window).resize(function(event){
		crearFn(function(){
			window.location.reload();
		});
	})

	//返回顶部
	$('.js-scrollTop').click(function(event){
		$(window).scrollTop(0);
		$('.js-pagesike').removeClass('active');
		$('.js-pagesike').eq(0).addClass('active');
	});

	// 给侧边栏添加指定class
	function addClas(index){
		var T = $(window).scrollTop();
		$('.js-page-title').each(function(i,element){
			var t = $(this).offset().top-100;
			if( T >= t ){
				$('.js-pagesike').removeClass('active');
				$('.js-pagesike').eq(i).addClass('active');
			}
		});
	}

	// 让侧边栏在滚动到指定区域时变成fixed定位
	function addFixed(){
		var T = $(window).scrollTop();
		if( T >= numTop ){
			$('.js-page-wrap').css({
				'position':'fixed',
				'top':60,
				'left':numLeft
			})
		}else{
			$('.js-page-wrap').css({
				'position':'static'
			})
		}
	}

	// 封装函数节流
	function crearFn(fn,content){
		clearTimeout(fn.timer);
		fn.timer = setTimeout(function(){
			fn.call(content);
		},100);
	}
};

// 自定义滚动条
weddingExpoFile.rillScrollBar = function(){
	var grounds=new YQHscrollGround();
		grounds.scrollBar({
			id:'gorund_wrapCs',	
			oN:true	
		});
};

// 轮播图
weddingExpoFile.flexslider = function(){
	if( !$('.flexslider').length ) return;
	$('.flexslider').flexslider({
		animation: "slide",					// 图片变换方式：淡入淡出(fade)或者滑动(slide)
		direction: "horizontal",       		// 图片滑动方向：左右(horizontal)、上下(vertical)
		directionNav: true, 				// 是否显示左右控制按钮(wap端要设置为false)
		slideshow: true,					// 是否自动播放
		randomize: false, 					// 是否随机幻灯片
		pauseOnHover:true,					// 鼠标移入按钮区域是否自动轮播
		controlNav: true,					// 是否显示控制菜单(小圆点)
		animationSpeed: 600,				// 滚动过度效果播放时长
		slideshowSpeed: 3000, 				// 自动播放速度毫秒
		mousewheel: true 					// 鼠标滚轮控制制图片滑动
	});
};

function YQHscrollGround(){
	this.opt={
		id:'',
		oN:false
	};
	this.oPraentWrap=null;
	this.contentWrap=null;
	this.groundWrap=null;
	this.ground=null;

	this.praentH=0;			//父级高度
	this.conterH=0;			//内容高度
	this.groundwH=0;		//滚动块外框高度
	this.num=0;				//滚动块的高度值
	this.maxConterNum=0;	//内容的top最大值
	this.maxGroundNum=0;	//小滚动块的top最大值
};

YQHscrollGround.prototype.scrollBar=function(opt){
	var This=this;
	$.extend(this.opt,opt);
    this.init();			//初始化
};

YQHscrollGround.prototype.init=function(){
	var This=this;
	this.oPraentWrap=$('#'+this.opt.id);
	this.contentWrap=this.oPraentWrap.find('.scroll-content-wrap');
	this.groundWrap=this.oPraentWrap.find('.scroll-ground-wrap');
	this.ground=this.oPraentWrap.find('.scroll-ground');

	this.praentH=this.oPraentWrap.outerHeight();
	this.conterH=this.contentWrap.outerHeight();
	this.groundwH=this.groundWrap.outerHeight();

	this.gdthHiddle();		//判断内容区域的高度是否超出外框高度，如果超出就隐藏滚动区域
	this.numGdtH();			//计算滚动块的高度值 = ( 父级外框高度/内容外框高度 )*滚动外框的高度
	this.scrollWeel();		//鼠标移入内容区域滚动滚动条
	if(this.opt.oN){		//开关打开时执行用户鼠标操作滚动小块
		this.eventWeel();
	};
};

YQHscrollGround.prototype.gdthHiddle=function(){
	if(this.conterH<=this.praentH){
		this.groundWrap.hide();
	};
};

YQHscrollGround.prototype.numGdtH=function(){
	this.num=( this.praentH/this.conterH ) * this.groundwH;
	this.ground.height(this.num);
};

YQHscrollGround.prototype.scrollWeel=function(){
	var This=this;
	if(this.conterH<=this.praentH) return;
	this.maxConterNum=this.conterH-this.praentH;
	this.maxGroundNum=this.groundwH-this.num;

	mousewheel(this.oPraentWrap.get(0),function(){
		//滚动小块的top值变化
		var numBot=This.ground.position().top-5;
		if(numBot<=0){ numBot=0 };
		This.ground.css('top',numBot);

		//内容区域的top值变化 内容区域能走的top值=(滚动小块走的top/滚动小块能走的最大top)*内容能走的最大top
		var contentTop=(numBot/This.maxGroundNum)*This.maxConterNum;	
		This.contentWrap.css('top',-contentTop);
	},function(){
		//滚动小块的top值变化
		var numBot=This.ground.position().top+5;
		if(numBot>=This.maxGroundNum){ numBot=This.maxGroundNum };
		This.ground.css('top',numBot);

		//内容区域的top值变化
		var contentTop=(numBot/This.maxGroundNum)*This.maxConterNum;
		This.contentWrap.css('top',-contentTop);
	});

	//封装鼠标滚轮事件 向上滚和向下滚
	function mousewheel(obj,upFn,downFn){
		obj.onmousewheel = mousewheelFn;
		if( obj.addEventListener ){
			obj.addEventListener("DOMMouseScroll",mousewheelFn,false);
		};
		function mousewheelFn(ev){
			ev = ev || event;
			var direction = true;
			//IE和谷歌下滚轮事件 判断上滚还是下滚
			if( ev.wheelDelta ){
				direction = ev.wheelDelta > 0 ? true : false;
			};
			//火狐下滚轮事件 判断上滚还是下滚
			if( ev.detail ){
				direction = ev.detail < 0 ? true : false;
			};
			//向上或向下 分别执行不同的函数
			if( direction ){
				typeof upFn === "function" && upFn(ev);
			}else{
				typeof downFn === "function" && downFn(ev)
			};
			//火狐下 清除浏览器默认样式 (使用addEventListener时return false是没用的)
			if( ev.preventDefault ){ ev.preventDefault() };
			//IE和谷歌下 清除浏览器默认样式
			ev.returnValue = false;
		};	
		//用法：upFn函数代表滚轮向上滚动
		//      downFn函数代表滚轮向下滚动
	};
};     

YQHscrollGround.prototype.eventWeel=function(){
	var This=this;
	this.ground.mousedown(function(event) {
		var GT=event.pageY-This.ground.position().top;
		$(document).mousemove(function(event) {
			//控制滚动小块的top值
			var GTX=event.pageY-GT;
			if(GTX<=0){ GTX=0 };
			if(GTX>=This.maxGroundNum){ GTX=This.maxGroundNum };
			This.ground.css('top',GTX);
			//控制内容区域的top值
			var CTX=(This.maxConterNum*GTX)/This.maxGroundNum;	// CTX = (内容区域能走的最大距离*小块走的top值)/小块能走的最大距离
			This.contentWrap.css('top',-CTX);
		});
		$(document).mouseup(function(event) {
			$(document).off();
		});
		return false;
	});
};

// 绑定click显示大图
weddingExpoFile.imgCover=function(activeDom,closeDom,coverDom){
	activeDom.click(function(){
		var src=$(this).attr("src");
		// console.log(src);
		coverDom.css({"display":"block"});
		coverDom.children("img").attr("src",src);
	})
	closeDom.click(function() {
		coverDom.css({"display":"none"});
	});
}
