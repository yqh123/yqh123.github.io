
$(function(){

	YD.threeDCarosel.init({
		picWidth:400,					//图片宽度
		picHeight:400,					//图片高度
		offset:200,						//背后元素左右偏移值
		unit:"px",						//指定以上参数的单位
		scale:0.8,						//非焦点图的缩放比例
		duration:3000, 					//自动滑动间隔时长，单位ms，间隔时长应该大于动画速度
		speed:600,						//动画速度，单位ms
		autoSlide:true,					//自动轮播
		touchSlide:true,				//触摸滑动
		hoverPause:true,				//鼠标移入暂停自动轮播，移出启动
		clickSlide:true,				//单击左右图片切换
		navSlide:true,				//点击导航切换
	});


	YD.copyCmd();					//复制命令
})

/**********************PC3D轮播图************************/
var YD={};
YD.threeDCarosel={
	defaults:{
		picWidth:400,
		picHeight:400,
		offset:200,
		unit:"px",
		scale:0.8,
		speed:300,
		duration:2000,
		autoSlide:true,
		touchSlide:true,
		hoverPause:true,
		clickSlide:true,
	},
	caroselBox:{},
	index:[],
	caroselLens:[],
	timer:[],
	ie8Style:{},
	stdStyle:{},
	isIE8:!$.support.leadingWhitespace,

	// 初始化
	init:function(settings){
		// 应用自定义设置
		for(var key in settings){
			this.defaults[key]=settings[key];
		}

		var that=this;
		var url=window.location.href;
		var isPC=!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
		var picWidth=that.defaults.picWidth;
		var picHeight=that.defaults.picHeight;
		var scale=that.defaults.scale;
		var offset=that.defaults.offset;
		var unit=that.defaults.unit;
		var ie8Style=that.ie8Style;
		var stdStyle=that.stdStyle;

		// 获取轮播图
		that.caroselBox=$(".threeD-carosel-box");

		// 设置宽高
		that.caroselBox.css({
			"width":picWidth+offset*scale*2+unit,
			"height":picHeight+unit,
		});
		that.caroselBox.children(".threeD-carosel").css({
			"width":picWidth+unit,
			"height":picHeight+unit,
		});
		that.caroselBox.find(".threeD-carosel li img").css({
			"width":picWidth+unit,
			"height":picHeight+unit,
		});

		// 编辑模式下，无轮播效果
		if( url.indexOf('static_edit') !=-1 ){
			that.caroselBox.find(".threeD-carosel li").css({"position":"static"});
			that.caroselBox.css({
				"overflow-x":"hidden",
				"overflow-y":"scroll"
			})
		}else{
			// 修正编辑模式的影响
			that.caroselBox.find(".threeD-carosel li").css({"position":"absolute"});
			that.caroselBox.css({"overflow":"visible"})

			// IE8_CSS
			ie8Style.liCss={"width":scale*100+"%","height":scale*100+"%","margin":0,"top":0};
			ie8Style.leftCss={"width":scale*100+"%","height":scale*100+"%","top":(1-scale)/2*100+"%","left":0,"right":"auto","margin-left":-offset+unit};
			ie8Style.rightCss={"width":scale*100+"%","height":scale*100+"%","top":(1-scale)/2*100+"%","left":"auto","right":0,"margin-right":-offset+unit};
			ie8Style.targetCss={"width":"100%","height":"100%","margin":0,"top":0};

			// 其他浏览器_CSS
			var liTransition=addPrefix("transition","transform "+that.defaults.speed+"ms ease-out",["-moz-","-webkit-","-o-"]);
			var liTransform=addPrefix("transform","translate3d(0, 0,0) scale("+scale+")",["-ms-","-moz-","-webkit-","-o-"]);

			stdStyle.liCss=joinJSON([liTransform,liTransition]);

			stdStyle.leftCss=addPrefix("transform","translate3d(-"+offset+unit+", 0, 0) scale("+scale+")",["-ms-","-moz-","-webkit-","-o-"]);
			stdStyle.rightCss=addPrefix("transform","translate3d("+offset+unit+", 0, 0) scale("+scale+")",["-ms-","-moz-","-webkit-","-o-"]);
			stdStyle.targetCss=addPrefix("transform","translate3d(0,0,0) scale(1)",["-ms-","-moz-","-webkit-","-o-"]);

			// 添加css前缀
			function addPrefix(prop,value,prefixs){
				var cssObj={};
				cssObj[prop]=value;
				for(var i=0;i<prefixs.length;i++){
					cssObj[prefixs[i]+prop]=value;
				}
				return cssObj;
			}

			// 拼接JSON对象
			function joinJSON(JSONArr){
				var jsonStr="";
				for(var i=0;i<JSONArr.length;i++){
					jsonStr+=JSON.stringify(JSONArr[i]);
				}
				jsonStr=jsonStr.replace("}{",",");
				return JSON.parse(jsonStr);
			}
			
			// 初始样式
			if(that.isIE8){
				that.caroselBox.find(".threeD-carosel li").css(ie8Style.liCss);
			}else{
				that.caroselBox.find(".threeD-carosel li").css(stdStyle.liCss);
			}

			// 启动所有轮播图
			this.caroselBox.each(function(i){
				var dotHtml=[];
				var timer=null;
				var lis=$(this).find(".threeD-carosel li");
				var carosel=$(this).children(".threeD-carosel");
				var caroselBox=$(this);

				that.index.push(0);

				// 添加初始样式
				if(that.isIE8){
					lis.eq(0).addClass('target').css(ie8Style.targetCss);
					lis.eq(1).addClass('right').css(ie8Style.rightCss);
					lis.eq(lis.length-1).addClass('left').css(ie8Style.leftCss);
				}else{
					lis.eq(0).addClass('target').css(stdStyle.targetCss);
					lis.eq(1).addClass('right').css(stdStyle.rightCss);
					lis.eq(lis.length-1).addClass('left').css(stdStyle.leftCss);
				}
				
				that.caroselLens.push(lis.length);
				
				// 添加控制点
				for(var i=0;i<lis.length;i++){
					i==0?dotHtml.push("<li class='selected'></li>"):dotHtml.push("<li></li>");
				}
				$(this).children(".carosel-nav").html(dotHtml.join(""));

				// 自动轮播
				if(that.defaults.autoSlide){
					timer=setTimeout(function(){that.autoSlide(caroselBox)},that.defaults.duration);
					that.timer.push(timer);
				}

				// 绑定点击事件
				if(that.defaults.clickSlide){
					$(this).find(".threeD-carosel .left").click(function(){
						that.slideRight(caroselBox);
					});
					$(this).find(".threeD-carosel .right").click(function(){
						that.slideLeft(caroselBox);
					});
				}

				// 触摸滑动
				if(that.defaults.touchSlide&&(!isPC)){
					that.touchSlide(caroselBox);
				}

				// 导航切换
				if(that.defaults.navSlide){
					that.navSlide(caroselBox);
				}
			})

			// PC端鼠标移入暂停自动轮播 
			if(that.defaults.hoverPause&&that.defaults.autoSlide&&isPC){
				$(".threeD-carosel-box").hover(function(){
					that.stopAutoSlide($(this));
				},function(){
					that.startAutoSlide($(this));
				})
			}
		}
	},

	// 右滑
	slideRight:function(caroselBox){
		var that=YD.threeDCarosel;
		var carosel=caroselBox.children(".threeD-carosel");
		var i=that.caroselBox.index(caroselBox);
		var addLeftCss;

		// 解绑旧元素click事件
		that.offClick(caroselBox);

		function slide(that){
			// 切换主体
			carosel.children(".right").removeClass("right").css(that.liCss);
			carosel.children(".target").addClass("right").removeClass("target").css(that.rightCss);
			carosel.children(".left").addClass("target").removeClass("left left1").css(that.targetCss);

			// 代码复用
			return function(i){
				carosel.children("li").eq(i).addClass("left left1").css(that.leftCss);
			}
		}

		// IE8
		if(that.isIE8){
			addLeftCss=slide(that.ie8Style);
		//其他浏览器 
		}else{
			addLeftCss=slide(that.stdStyle);
		}
		

		if(that.index[i]==0){
			addLeftCss(that.caroselLens[i]-2);
		}else if(that.index[i]==1){
			addLeftCss(that.caroselLens[i]-1);
		}else{
			addLeftCss(that.index[i]-2);
		}

		// 迭代index
		if(that.index[i]==0){
			that.index[i]=that.caroselLens[i]-1;
		}else{
			that.index[i]--;
		}

		// 切换导航样式
		that.toggleNav(caroselBox,that.index[i]);

		// 给新元素绑定click事件
		that.onClick(caroselBox);
	},

	// 左滑
	slideLeft:function(caroselBox){
		var that=YD.threeDCarosel;
		var carosel=caroselBox.children(".threeD-carosel");
		var i=that.caroselBox.index(caroselBox);
		var addRightCss;

		// 调整左右层叠关系
		if(carosel.children(".left").hasClass('left1')){
			carosel.children(".left").removeClass('left1');
		}

		// 解绑旧元素click事件
		that.offClick(caroselBox);

		function slide(that){
			// 切换主体
			carosel.children(".left").removeClass("left").css(that.liCss);
			carosel.children(".target").addClass("left").removeClass("target").css(that.leftCss);
			carosel.children(".right").addClass("target").removeClass('right').css(that.targetCss);

			// 代码复用
			return function addRightCss(i){
				carosel.children("li").eq(i).addClass('right').css(that.rightCss);
			}
		}
		// IE8
		if(that.isIE8){
			addRightCss=slide(that.ie8Style);
		// 其他浏览器
		}else{
			addRightCss=slide(that.stdStyle);
		}

		// 重选右侧元素
		if(that.index[i]==(that.caroselLens[i]-2)){
			addRightCss(0);
		}else if(that.index[i]==(that.caroselLens[i]-1)){
			addRightCss(1);
		}else{
			addRightCss(that.index[i]+2);
		}

		if(that.index[i]==(that.caroselLens[i]-1)){
			that.index[i]=0;
		}else{
			that.index[i]++;
		}

		// 切换导航样式
		that.toggleNav(caroselBox,that.index[i]);

		// 给新元素绑定click事件
		that.onClick(caroselBox);
	},

	// 自动轮播
	autoSlide:function(caroselBox){
		var that=this;
		var i=that.caroselBox.index(caroselBox);

		that.slideLeft(caroselBox);

		// 定时器
		that.timer[i]=setTimeout(function(){that.autoSlide(caroselBox)},that.defaults.duration);
	},

	// 触摸滑动
	touchSlide:function(caroselBox){
		var that=this;
		var startX,startY,endX,endY;

		caroselBox[0].addEventListener("touchstart",touch,false);
		caroselBox[0].addEventListener("touchend",touch,false);

		function touch(event){
			var event =event||window.event;

			// 阻止同级冒泡
			event.stopImmediatePropagation();

			if(event.type=="touchstart"){
				startX=event.touches[0].clientX;
				startY=event.touches[0].clientY;

				// 停止自动轮播
				if(that.defaults.autoSlide){
					that.stopAutoSlide(caroselBox);
				}

			}else if(event.type=="touchend"){
				endX=event.changedTouches[0].clientX;
				endY=event.changedTouches[0].clientY;

				if((endX-startX)<-100){
					that.slideLeft(caroselBox);
				}else if((endX-startX)>100){
					that.slideRight(caroselBox);
				}

				// 开启自动轮播
				if(that.defaults.autoSlide){
					that.startAutoSlide(caroselBox);
				}
			}
		}
	},

	// 单击导航切换
	navSlide:function(caroselBox){
		caroselBox.find(".carosel-nav li").click(function(){
			var that=YD.threeDCarosel;
			var navs=caroselBox.find(".carosel-nav li");
			var navIndex=navs.index($(this));
			var caroselIndex=that.caroselBox.index(caroselBox);
			var classArr=["left","right","target"];

			that.offClick(caroselBox);

			function slide(that){
				for(var i=0;i<classArr.length;i++){
					caroselBox.find("."+classArr[i]).removeClass(classArr[i]+" "+classArr[i]+"1").css(that.liCss);
				}

				caroselBox.find(".threeD-carosel li").eq(navIndex).addClass("target").css(that.targetCss);

				if(navIndex==0){
					caroselBox.find(".threeD-carosel li").eq(navs.length-1).addClass("left").css(that.leftCss);
				}else{
					caroselBox.find(".threeD-carosel li").eq(navIndex-1).addClass("left").css(that.leftCss);
				}

				if(navIndex==(navs.length-1)){
					caroselBox.find(".threeD-carosel li").eq(0).addClass("right").css(that.rightCss);
				}else{
					caroselBox.find(".threeD-carosel li").eq(navIndex+1).addClass("right").css(that.rightCss);
				}
			}
			
			// IE8
			if(that.isIE8){
				slide(that.ie8Style);
			// 其他浏览器
			}else{
				slide(that.stdStyle);
			}

			that.index[caroselIndex]=navIndex;
			// 切换导航样式
			that.toggleNav(caroselBox,navIndex);

			that.onClick(caroselBox);
		})
	},

	// 停止自动轮播
	stopAutoSlide:function(caroselBox){
		var that=this;
		var i=that.caroselBox.index(caroselBox);
		clearTimeout(that.timer[i]);
		that.timer[i]=null;
	},

	// 开启自动轮播
	startAutoSlide:function(caroselBox){
		var that=this;
		var i=that.caroselBox.index(caroselBox);
		if(!that.timer[i]){
			that.timer[i]=setTimeout(function(){that.autoSlide(caroselBox)},that.defaults.duration);
		}
	},

	// 解绑click
	offClick:function(caroselBox){
		caroselBox.find(".left").off("click");
		caroselBox.find(".right").off("click");
	},

	// 绑定click
	onClick:function(caroselBox){
		var that=this;
		caroselBox.find(".left").click(function(){
			that.slideRight(caroselBox);
		});
		caroselBox.find(".right").click(function(){
			that.slideLeft(caroselBox);
		});
	},

	// 切换导航样式
	toggleNav:function(caroselBox,i){
		caroselBox.find(".carosel-nav li").eq(i).addClass("selected").siblings().removeClass('selected');
	}
}
/**********************PC3D轮播图 end************************/



		
// 复制命令
YD.copyCmd=function(){
	$(".common-btn").click(function(){
		var txtarea=$(".threed-carosel-js");
		txtarea.focus();
	    txtarea[0].setSelectionRange(0, txtarea.html().length);
	    document.execCommand("copy",true);
	    $(".common-btn-box .tooltip").fadeIn();
	    setTimeout(function(){
	    	$(".common-btn-box .tooltip").fadeOut();
	    },2000)
	})
	
}
