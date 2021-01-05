
/*54客服
---------------------------------------------------------------------------------*/
$(document).ready(function(){
	$("#kfoutbox .kf54kefuqqbottom a").attr("href","/contact/columnsId=36&&i=4&comContentId=4.html");
});

	
/*网站控制链接
---------------------------------------------------------------------------------*/
$(document).ready(function(){
	$("#FrontComContent_list01-001 .menu-first ul li:eq(2)  a").attr("href","../../pic/&i=4&comContentId=4.html"/*tpa=http://www.gzfezx.net/pic/&i=4&comContentId=4.html*/);
	/*图册*/
	//$("#FrontComContent_list01-001_contact .menu-first ul li:eq(1)  a").attr("href","../../messages_list/&i=5&comContentId=5.html"/*tpa=http://www.gzfezx.net/messages_list/&i=5&comContentId=5.html*/);
	/*在线留言*/
});
	
/*读取通用页标题
---------------------------------------------------------------------------------*/
$(document).ready(function(){
		//var title = $(".FrontComContent_detail01-d1_c1 .title").html();
		//alert(title);	
		//$("#right_top_l").html(title);
}); 
	
/*网站导航当前状态配置
---------------------------------------------------------------------------------*/
$(document).ready(function(){
	
	$(".FrontColumns_navigation01-d6_c1 ul li a span").each(function(){
			var classify=$(this).html();	
			var crumbs=$(".FrontPublic_breadCrumb01-d1_c1 div a:eq(1)").html();
			if(classify.indexOf(crumbs)>-1)
				$(this).parent("li").addClass("current");
				//alert(classify); 
	});/*FrontColumns_navigation01-d2_c1*/
	
});

	
/*网站侧导栏当前状态配置
---------------------------------------------------------------------------------*/
$(document).ready(function(){
	
	$(".FrontProductsCategory_show01-d1_c1 .menu-first ul li a").each(function(){
			var classify=$(this).html();	
			var crumbs=$(".FrontPublic_breadCrumb01-d1_c1 div a:eq(2)").html();
			if(classify.indexOf(crumbs)>-1)
				$(this).parent("li").addClass("current");
	});/*产品*/
	
	$(".FrontNewsCategory_tree01-d1_c1 .menu-first ul li a").each(function(){
			var classify=$(this).html();	
			var crumbs=$(".FrontPublic_breadCrumb01-d1_c1 div a:eq(2)").html();
			if(classify.indexOf(crumbs)>-1)
				$(this).parent("li").addClass("current");
	});/*新闻*/
	
});
	

/*漂浮二维码
---------------------------------------------------------------------------------*/
$(document).ready(function(e) {
	function b(){
		h = $(window).height();
		t = $(document).scrollTop();
		if(t > h){
			$('#gotop').show();
		}else{
			$('#gotop').hide();
		}
	}

	b();
	$('#gotop').click(function(){
		$(document).scrollTop(0);	
	})
	$('#code').hover(function(){
			$(this).attr('id','code_hover');
			$('#code_img').show();
		},function(){
			$(this).attr('id','code');
			$('#code_img').hide();
	})
	
});

$(window).scroll(function(e){
	b();		
})

/*收藏按钮
---------------------------------------------------------------------------------*/
$(document).ready(function(){
	function addToFav() {
		var url = "中企动力";
		var title = "http://www.300.cn/}";
	
		if (window.sidebar) { // Mozilla Firefox Bookmark
			window.sidebar.addPanel(title, url, "");
		} else if (document.all) { // IE Favorite
			window.external.AddFavorite(url, title);
		} else if (window.opera) { // Opera 7+
			return false; // do nothing
		} else {
			alert('检测到您的浏览器无法自动实现此功能,您可以手动使用Ctrl+D 或 Cmd+D收藏本站.');
		}
	}
});

/*网站禁止右键代码
---------------------------------------------------------------------------------*/
//var Prohibit_Right=true;//true开启;false关闭
var Prohibit_Right=false;
if(Prohibit_Right==true){
		$(document).ready(function(){
			document.oncontextmenu=new Function("event.returnValue=false;");
			document.onselectstart=new Function("event.returnValue=false;");
		});
	}

/*取消全局title
---------------------------------------------------------------------------------*/
/*$(document).ready(function(){
	$('a').each(function(){
	 $(this).attr('title','');
	});
});*/


/*单击事件
---------------------------------------------------------------------------------*/
/*$(document).ready(function(){
	$("#FrontSpecifies_show01-1394158047887 a").click(function(){
		$(".gz_right").fadeOut("slow");
	});
});*/
	
/*屏蔽js错误
---------------------------------------------------------------------------------*/
//window.onerror=function(){return true;};
	
/*获得键盘上对应的ascII码
---------------------------------------------------------------------------------*/
/*$(document).ready(function(){
		$('input').keydown(function(event){ 
		   alert(event.keyCode); 
		 });
});*/
$(document).ready(function(){
$('.silder_con .silder_panel').jfade({
	start_opacity: "1",//初始透明度
	high_opacity: "1",//鼠标出发时透明度
	low_opacity: ".4",//其他透明度
	timing: "1500"//速度
	});
});  