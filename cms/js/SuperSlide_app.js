$(document).ready(function(){
	jQuery("#Columns_navigation01-d6_c1_FrontColumns_navigation01-topnav").slide({ type:"menu",titCell:".m",targetCell:".nav-second",effect:"slideDown",delayTime:300,triggerTime:0,defaultPlay:false,returnDefault:true,titOnClassName:"current",easing:"easeOutCubic"});
	//$('.FrontColumns_navigation01-d6_c1 .nav-second li:first').addClass("first");
	//$('.FrontColumns_navigation01-d6_c1 .nav-second li:last').addClass("last");
	$(".FrontColumns_navigation01-d6_c1 .nav-second").append("<div class='clearBoth pt10'></div>");
	$(".FrontColumns_navigation01-d6_c1 .nav-second").prepend("<div class='clearBoth pt10'></div>");
	/*导航*/
	
	jQuery(".slideBox").slide({mainCell:".bd ul",autoPlay:true,delayTime:700});
	/*首页幻灯片*/
	
	jQuery("#box_index_scroll").slide({titCell:".hd ul",mainCell:".silder_con",autoPage:true,effect:"leftLoop",autoPlay:true,scroll:3,vis:3,delayTime:700});
	/*首页滚动图*/
	
	jQuery("#box_news_sroll").slide({titCell:".hd ul",mainCell:".newslist-01",autoPage:true,effect:"top",autoPlay:true,scroll:1,vis:1});
	/*首页新闻*/
	
	jQuery("#box_foot_scroll").slide({titCell:".hd ul",mainCell:".main",autoPage:true,effect:"leftLoop",autoPlay:true,scroll:1,vis:5,delayTime:700});
	/*友情链接*/
	
	jQuery(".sideMen").slide({titCell:"h3 i",targetCell:".sideMen_cont",trigger:"click"});
	/*常见问题*/
	
	jQuery(".products_select").slide({type:"menu",titCell:".products_cot_2",targetCell:".hide",effect:"slideDown",delayTime:300,triggerTime:0,defaultPlay:false,returnDefault:true});
	/*产品筛选*/
	
	//jQuery(".products_list").slide({type:"menu",titCell:".pic",targetCell:".pic_b",delayTime:300,triggerTime:0,defaultPlay:false,returnDefault:true});
	/*产品大图*/
	
	jQuery(".classify").slide({titCell:"ul li span",targetCell:".child",defaultPlay:false,effect:"slideDown",trigger:"click"});
	/*侧导航*/
	
	jQuery(".pic_list").slide({mainCell:".pic_list_content ul",autoPage:true,effect:"leftLoop",scroll:4,vis:4});
	/*产品详细小图切换*/
	
	jQuery(".products_detail_right").add(".detail").add(".history").add(".honor").slide();
	/*产品信息*//*产品详细*//*发展历程*//*资质荣誉*/
	
});