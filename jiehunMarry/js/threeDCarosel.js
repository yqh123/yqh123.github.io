
$(function(){

	YD.threeDCarosel.init({
	picWidth:"400px",				//图片宽度，必须有单位，可为px/rem，根据需要自己定义，下同
	picHeight:"400px",				//图片高度
	focusDepth:"300px",				//景深
	backEleOffset:"300px",			//背后元素左右偏移值
	duration:2000, 					//间隔时长，单位ms，间隔时长应该大于动画速度
	speed:300,						//动画速度，单位ms
	autoSlide:true,					//自动轮播
	touchSlide:true,				//触摸滑动
	hoverPause:true,				//鼠标移入暂停自动轮播，移出启动
	clickTurnover:true,				//单击左右图片可切换
	
});


	YD.copyCmd();					//复制命令
})

/**********************PC3D轮播图************************/
var YD={};
YD.threeDCarosel={
	defaults:{
		picWidth:"300px",
		picHeight:"300px",
		focusDepth:"200px",
		backEleOffset:"300px",
		perspective:"800px",
		speed:300,
		duration:2000,
		autoSlide:true,
		touchSlide:true,
		hoverPause:true,
		clickTurnover:true,
	},
	caroselBox:{},
	index:[],
	caroselLens:[],
	timer:[],
	liTransform:{},
	leftTransform:{},
	rightTransform:{},
	targetTransform:{},

	// 初始化
	init:function(settings){
		var that=this;
		var url=window.location.href;
		var isPC=!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);

		// 应用自定义设置
		for(var key in settings){
			that.defaults[key]=settings[key];
		}

		// 获取轮播图
		that.caroselBox=$(".threeD-carosel-box");

		// 设置宽高
		that.caroselBox.css({
			"width":that.defaults.picWidth+"",
			"height":that.defaults.picHeight+"",
		});
		that.caroselBox.find($(".threeD-carosel li img")).css({
			"width":that.defaults.picWidth+"",
			"height":that.defaults.picHeight+"",
		});

		// 编辑模式下，无轮播效果
		if( url.indexOf('static_edit') !=-1 ){
			that.caroselBox.find($(".threeD-carosel li")).css({"position":"static"});
			that.caroselBox.css({
				"overflow-x":"hidden",
				"overflow-y":"scroll"
			})
		}else{
			// 修正编辑模式的影响
			that.caroselBox.find($(".threeD-carosel li")).css({"position":"absolute"});
			that.caroselBox.css({"overflow":"visible"})

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

			// 添加css前缀
			var liTransition=addPrefix("transition","transform "+that.defaults.speed+"ms ease-out",["-moz-","-webkit-","-o-"]);
			that.liTransform=addPrefix("transform","translate3d(0, 0, -"+that.defaults.focusDepth+")",["-ms-","-moz-","-webkit-","-o-"]);

			var liCss=joinJSON([that.liTransform,liTransition]);

			that.leftTransform=addPrefix("transform","translate3d(-"+that.defaults.backEleOffset+", 0, -"+that.defaults.focusDepth+")",["-ms-","-moz-","-webkit-","-o-"]);
			that.rightTransform=addPrefix("transform","translate3d("+that.defaults.backEleOffset+", 0, -"+that.defaults.focusDepth+")",["-ms-","-moz-","-webkit-","-o-"]);
			that.targetTransform=addPrefix("transform","translate3d(0,0,0)",["-ms-","-moz-","-webkit-","-o-"]);


			// 初始样式
			that.caroselBox.find($(".threeD-carosel")).css({
				"perspective":that.defaults.perspective
			});

			that.caroselBox.find($(".threeD-carosel li")).css(liCss);

			// 启动所有轮播图
			this.caroselBox.each(function(i){
				var dotHtml=[];
				var timer=null;
				var lis=$(this).find(".threeD-carosel li");
				var carosel=$(this).children(".threeD-carosel");
				var caroselBox=$(this);

				that.index.push(0);

				// 添加初始样式
				lis.eq(0).addClass('target').css(that.targetTransform);
				lis.eq(1).addClass('right').css(that.rightTransform);
				lis.eq(lis.length-1).addClass('left').css(that.leftTransform);
				that.caroselLens.push(lis.length);

				// 触摸滑动
				if(that.defaults.touchSlide){
					that.touchSlide(caroselBox);
				}
				


				// 添加控制点
				for(var i=0;i<lis.length;i++){
					i==0?dotHtml.push("<li class='selected'></li>"):dotHtml.push("<li></li>");
				}
				$(this).children(".control-dot").html(dotHtml.join(""));

				// 绑定点击事件
				if(that.defaults.clickTurnover){
					$(this).find(".threeD-carosel .left").click(function(){
						that.slideRight(caroselBox);
					});
					$(this).find(".threeD-carosel .right").click(function(){
						that.slideLeft(caroselBox);
					});
				}
				

				// 自动轮播
				if(that.defaults.autoSlide){
					timer=setTimeout(function(){that.autoSlide(caroselBox)},that.defaults.duration);
					that.timer.push(timer);
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

		// 解绑旧元素click事件
		that.offClick(caroselBox);

		// 切换主体
		carosel.children(".right").removeClass("right").css(that.liTransform);
		carosel.children(".target").addClass("right").removeClass("target").css(that.rightTransform);
		carosel.children(".left").addClass("target").removeClass("left left1").css(that.targetTransform);

		// 代码复用
		function addLeftCss(i){
			carosel.children("li").eq(i).addClass("left left1").css(that.leftTransform);
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

		// 切换控制点
		carosel.parent().find(".control-dot li").eq(that.index[i]).addClass("selected").siblings().removeClass('selected');

		// 给新元素绑定click事件
		that.onClick(caroselBox);
	},

	// 左滑
	slideLeft:function(caroselBox){
		var that=YD.threeDCarosel;
		var carosel=caroselBox.children(".threeD-carosel");
		var i=that.caroselBox.index(caroselBox);

		// 调整左右层叠关系
		if(carosel.children(".left").hasClass('left1')){
			carosel.children(".left").removeClass('left1');
		}

		// 解绑旧元素click事件
		that.offClick(caroselBox);

		// 切换主体
		carosel.children(".left").removeClass("left").css(that.liTransform);
		carosel.children(".target").addClass("left").removeClass("target").css(that.leftTransform);
		carosel.children(".right").addClass("target").removeClass('right').css(that.targetTransform);

		// 代码复用
		function addRightCss(i){
			carosel.children("li").eq(i).addClass('right').css(that.rightTransform);
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

		// 切换控制点
		carosel.parent().find(".control-dot li").eq(that.index[i]).addClass("selected").siblings().removeClass('selected');

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
