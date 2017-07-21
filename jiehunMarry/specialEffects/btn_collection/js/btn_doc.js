var YD={};
$(function(){
	// 自动生成侧边导航
	YD.creatSidenav($(".page-header"),$(".bs-docs-sidenav"));

	// 确定侧边导航位置
	YD.changePosition();
	$(window).scroll(function(){
	  YD.changePosition();
	})

	// 滚动到不同位置，高亮侧边导航对应主题
	YD.scrollChange($(".page-header"),$(".bs-docs-sidenav li"));

	// 单击展开收起源码
	YD.clickToggle($(".bs-example .extend-btn"),$(".highlight"));


	

})


// 滚动高亮侧边导航
YD.scrollChange=function(section,sidenav){
	$(window).scroll(function(){
		var timer;
		timer=setTimeout(function(){
			clearTimeout(timer);
			for(var i=section.length-1;i>=0;i--){
				if($(window).scrollTop()>=section.eq(i).offset().top){
					sidenav.eq(i).addClass('nav-selected').siblings().removeClass('nav-selected');
					return;
				}
			}
		})
			
		})
}

// 侧边导航位置
YD.changePosition=function(){
  if($(window).scrollTop()<256){
    $(".affix").css({"position":"absolute"});
  }else{
    $(".affix").css({"position":"fixed","top":"0"});
  }
}

// 展开收起
YD.clickToggle=function(btn,target){
	btn.click(function(){

		if($(this).html()=="展开源码+"){
			$(this).html("收起源码-")
		}else{
			$(this).html("展开源码+")
		}
		var index=btn.index($(this));
		target.eq(index).stop(true,true);
		target.eq(index).slideToggle();

	})
}

// 自动生成侧边导航
YD.creatSidenav=function(title,nav){
	var stringArr=[];
	for(var i=0;i<title.length;i++){
		stringArr.push("<li><a href=#"+title.eq(i).attr("id")+">"+title.eq(i).text()+"</a></li>");
	}
	nav.append(stringArr.join(""));
}