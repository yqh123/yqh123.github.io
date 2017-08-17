
$(function(){

	YD.threeDCarosel.init({
	picWidth:"400px",				//ͼƬ��ȣ������е�λ����Ϊpx/rem��������Ҫ�Լ����壬��ͬ
	picHeight:"400px",				//ͼƬ�߶�
	focusDepth:"300px",				//����
	backEleOffset:"300px",			//����Ԫ������ƫ��ֵ
	duration:2000, 					//���ʱ������λms�����ʱ��Ӧ�ô��ڶ����ٶ�
	speed:300,						//�����ٶȣ���λms
	autoSlide:true,					//�Զ��ֲ�
	touchSlide:true,				//��������
	hoverPause:true,				//���������ͣ�Զ��ֲ����Ƴ�����
	clickTurnover:true,				//��������ͼƬ���л�
	
});


	YD.copyCmd();					//��������
})

/**********************PC3D�ֲ�ͼ************************/
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

	// ��ʼ��
	init:function(settings){
		var that=this;
		var url=window.location.href;
		var isPC=!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);

		// Ӧ���Զ�������
		for(var key in settings){
			that.defaults[key]=settings[key];
		}

		// ��ȡ�ֲ�ͼ
		that.caroselBox=$(".threeD-carosel-box");

		// ���ÿ��
		that.caroselBox.css({
			"width":that.defaults.picWidth+"",
			"height":that.defaults.picHeight+"",
		});
		that.caroselBox.find($(".threeD-carosel li img")).css({
			"width":that.defaults.picWidth+"",
			"height":that.defaults.picHeight+"",
		});

		// �༭ģʽ�£����ֲ�Ч��
		if( url.indexOf('static_edit') !=-1 ){
			that.caroselBox.find($(".threeD-carosel li")).css({"position":"static"});
			that.caroselBox.css({
				"overflow-x":"hidden",
				"overflow-y":"scroll"
			})
		}else{
			// �����༭ģʽ��Ӱ��
			that.caroselBox.find($(".threeD-carosel li")).css({"position":"absolute"});
			that.caroselBox.css({"overflow":"visible"})

			// ���cssǰ׺
			function addPrefix(prop,value,prefixs){
				var cssObj={};
				cssObj[prop]=value;
				for(var i=0;i<prefixs.length;i++){
					cssObj[prefixs[i]+prop]=value;
				}
				return cssObj;
			}

			// ƴ��JSON����
			function joinJSON(JSONArr){
				var jsonStr="";
				for(var i=0;i<JSONArr.length;i++){
					jsonStr+=JSON.stringify(JSONArr[i]);
				}
				jsonStr=jsonStr.replace("}{",",");
				return JSON.parse(jsonStr);
			}

			// ���cssǰ׺
			var liTransition=addPrefix("transition","transform "+that.defaults.speed+"ms ease-out",["-moz-","-webkit-","-o-"]);
			that.liTransform=addPrefix("transform","translate3d(0, 0, -"+that.defaults.focusDepth+")",["-ms-","-moz-","-webkit-","-o-"]);

			var liCss=joinJSON([that.liTransform,liTransition]);

			that.leftTransform=addPrefix("transform","translate3d(-"+that.defaults.backEleOffset+", 0, -"+that.defaults.focusDepth+")",["-ms-","-moz-","-webkit-","-o-"]);
			that.rightTransform=addPrefix("transform","translate3d("+that.defaults.backEleOffset+", 0, -"+that.defaults.focusDepth+")",["-ms-","-moz-","-webkit-","-o-"]);
			that.targetTransform=addPrefix("transform","translate3d(0,0,0)",["-ms-","-moz-","-webkit-","-o-"]);


			// ��ʼ��ʽ
			that.caroselBox.find($(".threeD-carosel")).css({
				"perspective":that.defaults.perspective
			});

			that.caroselBox.find($(".threeD-carosel li")).css(liCss);

			// ���������ֲ�ͼ
			this.caroselBox.each(function(i){
				var dotHtml=[];
				var timer=null;
				var lis=$(this).find(".threeD-carosel li");
				var carosel=$(this).children(".threeD-carosel");
				var caroselBox=$(this);

				that.index.push(0);

				// ��ӳ�ʼ��ʽ
				lis.eq(0).addClass('target').css(that.targetTransform);
				lis.eq(1).addClass('right').css(that.rightTransform);
				lis.eq(lis.length-1).addClass('left').css(that.leftTransform);
				that.caroselLens.push(lis.length);

				// ��������
				if(that.defaults.touchSlide){
					that.touchSlide(caroselBox);
				}
				


				// ��ӿ��Ƶ�
				for(var i=0;i<lis.length;i++){
					i==0?dotHtml.push("<li class='selected'></li>"):dotHtml.push("<li></li>");
				}
				$(this).children(".control-dot").html(dotHtml.join(""));

				// �󶨵���¼�
				if(that.defaults.clickTurnover){
					$(this).find(".threeD-carosel .left").click(function(){
						that.slideRight(caroselBox);
					});
					$(this).find(".threeD-carosel .right").click(function(){
						that.slideLeft(caroselBox);
					});
				}
				

				// �Զ��ֲ�
				if(that.defaults.autoSlide){
					timer=setTimeout(function(){that.autoSlide(caroselBox)},that.defaults.duration);
					that.timer.push(timer);
				}
				
			})

			// PC�����������ͣ�Զ��ֲ� 
			if(that.defaults.hoverPause&&that.defaults.autoSlide&&isPC){
				$(".threeD-carosel-box").hover(function(){
					that.stopAutoSlide($(this));
				},function(){
					that.startAutoSlide($(this));
				})
			}
		}
	},

	// �һ�
	slideRight:function(caroselBox){
		var that=YD.threeDCarosel;
		var carosel=caroselBox.children(".threeD-carosel");
		var i=that.caroselBox.index(caroselBox);

		// ����Ԫ��click�¼�
		that.offClick(caroselBox);

		// �л�����
		carosel.children(".right").removeClass("right").css(that.liTransform);
		carosel.children(".target").addClass("right").removeClass("target").css(that.rightTransform);
		carosel.children(".left").addClass("target").removeClass("left left1").css(that.targetTransform);

		// ���븴��
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

		// ����index
		if(that.index[i]==0){
			that.index[i]=that.caroselLens[i]-1;
		}else{
			that.index[i]--;
		}

		// �л����Ƶ�
		carosel.parent().find(".control-dot li").eq(that.index[i]).addClass("selected").siblings().removeClass('selected');

		// ����Ԫ�ذ�click�¼�
		that.onClick(caroselBox);
	},

	// ��
	slideLeft:function(caroselBox){
		var that=YD.threeDCarosel;
		var carosel=caroselBox.children(".threeD-carosel");
		var i=that.caroselBox.index(caroselBox);

		// �������Ҳ����ϵ
		if(carosel.children(".left").hasClass('left1')){
			carosel.children(".left").removeClass('left1');
		}

		// ����Ԫ��click�¼�
		that.offClick(caroselBox);

		// �л�����
		carosel.children(".left").removeClass("left").css(that.liTransform);
		carosel.children(".target").addClass("left").removeClass("target").css(that.leftTransform);
		carosel.children(".right").addClass("target").removeClass('right').css(that.targetTransform);

		// ���븴��
		function addRightCss(i){
			carosel.children("li").eq(i).addClass('right').css(that.rightTransform);
		}

		// ��ѡ�Ҳ�Ԫ��
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

		// �л����Ƶ�
		carosel.parent().find(".control-dot li").eq(that.index[i]).addClass("selected").siblings().removeClass('selected');

		// ����Ԫ�ذ�click�¼�
		that.onClick(caroselBox);
	},

	// �Զ��ֲ�
	autoSlide:function(caroselBox){
		var that=this;
		var i=that.caroselBox.index(caroselBox);

		that.slideLeft(caroselBox);

		// ��ʱ��
		that.timer[i]=setTimeout(function(){that.autoSlide(caroselBox)},that.defaults.duration);
	},

	// ��������
	touchSlide:function(caroselBox){
		var that=this;
		var startX,startY,endX,endY;

		caroselBox[0].addEventListener("touchstart",touch,false);
		caroselBox[0].addEventListener("touchend",touch,false);

		function touch(event){
			var event =event||window.event;

			// ��ֹͬ��ð��
			event.stopImmediatePropagation();

			if(event.type=="touchstart"){
				startX=event.touches[0].clientX;
				startY=event.touches[0].clientY;

				// ֹͣ�Զ��ֲ�
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

				// �����Զ��ֲ�
				if(that.defaults.autoSlide){
					that.startAutoSlide(caroselBox);
				}
			}
		}
	},

	// ֹͣ�Զ��ֲ�
	stopAutoSlide:function(caroselBox){
		var that=this;
		var i=that.caroselBox.index(caroselBox);
		clearTimeout(that.timer[i]);
		that.timer[i]=null;
	},

	// �����Զ��ֲ�
	startAutoSlide:function(caroselBox){
		var that=this;
		var i=that.caroselBox.index(caroselBox);
		if(!that.timer[i]){
			that.timer[i]=setTimeout(function(){that.autoSlide(caroselBox)},that.defaults.duration);
		}
	},

	// ���click
	offClick:function(caroselBox){
		caroselBox.find(".left").off("click");
		caroselBox.find(".right").off("click");
	},

	// ��click
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
/**********************PC3D�ֲ�ͼ end************************/


		
// ��������
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
