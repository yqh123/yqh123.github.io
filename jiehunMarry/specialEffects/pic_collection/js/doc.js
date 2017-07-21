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

	// 单击编辑文字按钮，隐藏链接层
	YD.closeEditCover($(".pic-effect .edit-btn .edit-txt"),$(".pic-effect .edit-btn"),$(".pic-effect a"));
	// 单击编辑图片按钮，隐藏文字层
	YD.closeEditCover($(".pic-effect .edit-btn .edit-pic"),$(".pic-effect .edit-btn"),$(".pic-effect .middle-cover"));
	// 单击返回按钮，显示当前图片结构中所有被隐藏的层
	$(".pic-effect .edit-btn .back").click(function(){
		var index=$(".pic-effect .edit-btn .back").index($(this));
		$(".pic-effect a").eq(index).css({"display":"block"});
		$(".pic-effect .middle-cover").eq(index).css({"display":"block"});
		$(this).css({"display":"none"});
		$(this).parent().children().first().css({"display":"block"});
	})

	// 显示编辑层，单击对应按钮使各结构层可编辑
	$(".show_edit_btn").click(function(){
		if($(this).html()=="查看编辑层"){
			// 显示编辑层
			$(".pic-effect .edit-btn").css({"display":"block"});
			
			$(this).html("关闭编辑层");

		}else{
			// 显示编辑层
			$(".pic-effect .edit-btn").css({"display":"none"});

			$(this).html("查看编辑层");
		}
		
		
	})
	

})

// 隐藏目标按钮和遮罩层，显示下个按钮
YD.closeEditCover=function(btn,btn_box,cover){
		btn.click(function(){
			var index=btn_box.index($(this).parent());
			// 隐藏当前按钮对应的层
			cover.eq(index).css({"display":"none"});
			// 隐藏当前按钮
			$(this).css({"display":"none"});
			// 显示下一个按钮
			$(this).next().css({"display":"block"});
		})
	}

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