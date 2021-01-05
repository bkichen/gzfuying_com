$(document).ready(function(){
    //首页焦点图
    (function(){
        var $slider = $("#home-adv-slider");
        if(!$slider.length){return false;}
        $slider.mobileSlider({isAuto:true, showNav: true, showSubject: false});
    })();

    //头部返回按钮
    (function(){
        $("header a.icon-back")
            .attr("href", "javascript:;")
            .hammer().on("tap", function(){
                history.back();
            });
    })();

    //头部弹出更多
    (function(){
        var $box = $("#more-fn");
        var $trigger = $("#menu");
        if($box.length === 0 || $trigger.length === 0){
            return false;
        }

        $trigger.hammer().on("tap", function(e){
            $box.toggleClass("hide-me");
            e.stopPropagation();
        });

        $(document).hammer().on("tap", function(e){
            if((!$(e.target).is($box)) && (!$(e.target).is($trigger))){
                $box.addClass("hide-me");
            }
        });

        $box.hammer().on("tap", function(e){
            e.stopPropagation();
        });
    })();

    //调整底部的位置以适应不同的屏幕尺寸
    (function(){
        var $box = $(".middle-box");
        var $winHeight = $(window).height();
        var $headerHeight = $("header .fixed").outerHeight();
        var $footerHeight = $("footer").outerHeight();
        var difHeight = $winHeight - $headerHeight - $footerHeight;

        window.onload = function(){
            if($box.outerHeight() < difHeight){
                $box.height(difHeight - ($box.outerHeight() - $box.height()) + "px");
            }
        };
    })();

    //提交成功样式设置
    (function(){
        var $wrap = $("#success");
        if(!$wrap.length){ return; }

        $wrap.find("p").height($(window).height() - 166 + "px");
    })();

    //表单页面
    (function(){
        var $wrap = $("#form-wrap");
        if(!supportInputType("date")){
            $wrap.find("input.date").each(function(){
                $(this).calendar({defaultDate: "1980-6-1"});
                this.setAttribute("readonly", "readonly");
            });
        }else{
            $wrap.find("input.date").each(function(){
                var $that = $(this);
                var $parent = $that.parent();
                $parent.append('<b></b>');

                if($.trim($that.val()) !== ""){
                    $that.parent().addClass("no-placeholder");
                }

                $that.focus(function(){
                    $parent.addClass("no-placeholder");
                }).blur(function(){
                    if($.trim($that.val()) !== ""){
                        $parent.addClass("no-placeholder");
                    }else{
                        $parent.removeClass("no-placeholder");
                    }
                });
            });
        }
    })();
});

//tap event
function tap(node, callback){
    var startEvent = "mousedown", endEvent = "mouseup";

    if(typeof(window.ontouchstart) != "undefined"){
        startEvent = "touchstart";
        endEvent = "touchend";
    }

    node.addEventListener(startEvent, function(e){
        var tap = document.createEvent("CustomEvent");
        tap.initCustomEvent("tap", true, true, null);
        node.dispatchEvent(tap);
        e.preventDefault();
    });

    node.addEventListener(endEvent, function(e){
        var tapend = document.createEvent("CustomEvent");
        tapend.initCustomEvent("tapend", true, true, null);
        node.dispatchEvent(tapend);
        e.preventDefault();
    });

    node.addEventListener("tap", callback);
}


//类型检查
function supportInputType(type){
    var input = document.createElement("input");
    input.setAttribute("type", type);
    if(input.type === "text" && type !== "text"){
        return false;
    }
    return true;
}

//属性检查
function supportAttribute(eleName, attr){
    var ele = document.createElement(eleName);
    return (attr in ele);
}

//slider
;(function($, window){
	var confing = {
		speed: 300,
		interval: 5000,
		startSlide: 0,
		isAuto: false,
		showSubject: true,
		showNav: false,
        onSlideAfter: function() {}
	};

    $.fn.mobileSlider = function(settings){
		if(this.length == 0) return this;

		if(this.length > 1){
			this.each(function(){$(this).mobileSlider(settings)});
			return this;
        }

		var slider = {};
		var el = this;
		var timer;
		var wrapWidth = this.width();

		var init = function(){
			slider.confing = $.extend({}, confing, settings);
			
			slider.ul = el.find("ul");
			slider.li = el.find("li");
			slider.images = el.find("img");
			slider.len = slider.images.length;
			slider.boxWidth = wrapWidth;
			slider.imgWidth = null;
			slider.imgHeight = null;
			slider.curIndex = 0;

			imgLoad(slider.images.first().attr("src"), function(w, h){
				slider.imgHeight = h * slider.boxWidth / w;
				slider.imgHeight = h < slider.imgHeight ? h : slider.imgHeight;
				slider.imgWidth = w * slider.imgHeight / h;
				slider.imgWidth = w < slider.imgWidth ? w : slider.imgWidth;
				slider.li.css({width: slider.boxWidth});
				slider.ul.append(slider.ul.html());
				slider.ul.css({width: (slider.boxWidth * slider.len * 2) + "px", marginLeft: -(slider.boxWidth * slider.len) + "px", height: slider.imgHeight + "px" });
				
				if(slider.confing.showSubject){
					var str = '<div><ol>';
					slider.images.each(function(index){
						str += '<li><span>'+ $(this).attr("alt") +'</span></li>';
					});
					str += '</ol></div>';
					el.append(str);
					str = null;

					slider.ol = el.find("ol");
					slider.oli = slider.ol.find("li");
					slider.ol.css({width: slider.imgWidth + "px"});
					slider.oli.first().show();
				}

				if(slider.confing.showNav){
					var str = '<em>';
					slider.images.each(function(index){
						str += '<a href="javascript:;" data-i="'+ index +'"></a>';
					});
					str += '</em>';
					el.append(str);

					slider.nav = el.find("em");
					slider.navItem = slider.nav.find("a");
					slider.navItem.first().addClass("on");
				}
			});
		};

		var setup = function(){
			var _x1, _x2;
			el.get(0).addEventListener("touchstart", function(e){
                //e.preventDefault();
                if (!e.touches.length) return;
                var touch = e.touches[0];
                _x1 = touch.clientX;
			}, false);

			el.get(0).addEventListener("touchmove", function(e){
                //e.preventDefault();
                if (!e.touches.length) return;
                var touch = e.touches[0];
                _x2 = touch.clientX;
			}, false);

			el.get(0).addEventListener("touchend", function(e){
				if(Math.abs(_x1 - _x2) > 50){
					e.preventDefault();
					if((_x1 - _x2) > 0){
						moveLeft();
					}else{
						moveRight();
					}
					stop();
					setTimeout(play(), 5000);
				}
			}, false);
		};

		var moveLeft = function(){
			if(slider.curIndex === 0){
				slider.ul.css({marginLeft: - (slider.boxWidth * slider.len)});
				slider.curIndex = slider.len - 1;
			}else{
				slider.curIndex--;
			}

			if(slider.curIndex === 0){
				slider.ul.css({marginLeft: - (slider.boxWidth * slider.len) + slider.boxWidth});
			}

			if(!slider.ul.is(":animated")){
				slider.ul.animate({marginLeft: parseInt(slider.ul.css("marginLeft")) - slider.boxWidth}, slider.confing.speed);
				if(slider.confing.showSubject){
					if(slider.curIndex === 0){
						slider.oli.hide().eq(0).show();
					}else{
						slider.oli.hide().eq(slider.len - slider.curIndex).show();
					}				
				}
			}

			showNav();
			slider.confing.onSlideAfter();
		};

		var moveRight = function(){
			if(slider.curIndex + 1 === slider.len){
				
				slider.ul.css({marginLeft: - (slider.boxWidth * slider.len) - slider.boxWidth});
				slider.curIndex = 0;
			}else{
				slider.curIndex++;
			}

			if(!slider.ul.is(":animated")){
				slider.ul.animate({marginLeft: parseInt(slider.ul.css("marginLeft")) + slider.boxWidth}, slider.confing.speed);
				if(slider.confing.showSubject){
					if(slider.curIndex === 0){
						slider.oli.hide().eq(0).show();
					}else{
						slider.oli.hide().eq(slider.len - slider.curIndex).show();
					}
				}
			}

			showNav();
			slider.confing.onSlideAfter();
		};

		var stop = function(){
			window.clearInterval(timer);
		};

		var play = function(){
			timer = setInterval(function(){
				moveLeft();
			}, slider.confing.interval);
		};

		var imgLoad = function (url, callback) {
			var img = new Image();
			img.src = url;

			if (img.complete) {
				callback(img.width, img.height);
			} else {
				img.onload = function () {
					callback(img.width, img.height);
					img.onload = null;
				};
			}
		};

		var showNav = function(){
			if(slider.confing.showNav){
				slider.navItem.removeClass("on");
				slider.navItem.eq(slider.curIndex === 0 ? 0 : slider.len  - slider.curIndex).addClass("on");
			}
		};

		el.getCurIndex = function(){
			return slider.curIndex;
		};

		el.getLength = function(){
			return slider.len;
		};

		el.goToSlide = function(i){
			slider.ul.css({marginLeft: - (slider.boxWidth * slider.len) + slider.boxWidth });
			slider.ul.animate({marginLeft: parseInt(slider.ul.css("marginLeft")) - (slider.boxWidth * i) - slider.boxWidth}, slider.confing.speed);
			slider.curIndex = i;

			if(slider.confing.showSubject){
				slider.oli.hide().eq(slider.curIndex).show();
				slider.confing.onSlideAfter();
			}
		};

		$(window).on("resize", function(){ setup(); });
		
		init();
		setup();
		if(slider.confing.isAuto){play();}
		return this;
	};
})(jQuery, window);

//calendar
;(function($){
    $.fn.calendar = function(settings){
        var config = {
            defaultDate: new Date(),				//默认显示的日期
            selectedDate: null,						//默认选中的日期
            isShow: false,							//默认是否显示
            isAutoClose: true,						//是否在选择后关闭日历
            onInit: function($wrap){},				//初始化之前回调
            callback: function(value, $wrap){}		//选择日期后回调
        };

        if(settings){ $.extend(config, settings);}

        return this.each(function(){
            var $input = $(this);
            config.isShow && init($input);

            $input.on("click focus", function(){
                init($(this));
            });
        });

        function init($input){
            var now = config.defaultDate;

            if(config.defaultDate.constructor == String){
                var str = config.defaultDate.replace(/-/g, "/");
                if(isNaN(Date.parse(str))){
                    alert("指定的日期格式有误。example：2012-12-12");
                    return false;
                }

                now = new Date(Date.parse(str));//把日期字符串转换为日期对象
            }

            var nowYear = now.getFullYear();
            var nowMonth = now.getMonth();
            var nowDate = now.getDate();

            $input.blur();
            $("#dd-calendar").remove();
            $("body").append('<div id="dd-calendar" class="dd-calendar"><div class="cld-head"><em class="prev"></em><i class="prev"></i><p><span class="year"></span>年<span class="month"></span>月</p><i class="next"></i><em class="next"></em></div><div class="cld-body" id="cld-body"></div></div>');
            var $wrap = $("#dd-calendar");
            config.onInit($wrap);

            //初始化
            build(nowYear, nowMonth + 1, $wrap);
            config.isShow ? $wrap.css({position: "static", bottom: 0}) : $wrap.animate({bottom: 0}, 500);

            //上一年
            $wrap.on("click", "em.prev", function(){
                var year = parseInt($wrap.find("span.year").html());
                var month = parseInt($wrap.find("span.month").html());
                build(--year, month, $wrap);
            });

            //下一年
            $wrap.on("click", "em.next", function(){
                var year = parseInt($wrap.find("span.year").html());
                var month = parseInt($wrap.find("span.month").html());
                build(++year, month, $wrap);
            });

            //上一月
            $wrap.on("click", "i.prev", function(){
                var year = parseInt($wrap.find("span.year").html());
                var month = parseInt($wrap.find("span.month").html());
                month = month - 1;
                if(month === 0){
                    year = year - 1;
                    month = 12;
                }
                build(year, month, $wrap);
            });

            //下一月
            $wrap.on("click", "i.next", function(){
                var year = parseInt($wrap.find("span.year").html());
                var month = parseInt($wrap.find("span.month").html());
                month = month + 1;
                if(month === 13){
                    year = year + 1;
                    month = 1;
                }
                build(year, month, $wrap);
            });

            //选择日期
            $wrap.on("click", "td.enabled", function(){
                var year = $wrap.find("span.year").html();
                var month = $wrap.find("span.month").html();
                var date = $(this).html();
                var dateStr = year + "-" + month + "-" + date;

                if($input.get(0).tagName.toLowerCase() === "input"){
                    $input.val(dateStr);
                }else{
                    $input.html(dateStr);
                }

                config.isAutoClose && $wrap.remove();
                config.callback(dateStr, $wrap);

                if(!config.isAutoClose){
                    $wrap.find("td.enabled").removeClass("selected");
                    $(this).addClass("selected");
                }
            });

            $wrap.click(function(e){
                e.stopPropagation();
            });

            $(document).on("click", function(e){
                if(!$(e.target).is($input) && !$(e.target).is($wrap)){
                    config.isAutoClose && $wrap.remove();
                }
            });
        }

        function build(targetYear, targetMonth, $wrap){
            var dates = (new Date(+(new Date(targetYear, targetMonth, 1)) - 86400000)).getDate(); //当月的天数
            var table = '<table><thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>';
            var arr = [];
            arr.push("<tbody>");

            var startDay = new Date(targetYear, targetMonth - 1, 1).getDay(); //当月的1号是星期几,用于计算当月1号的位置
            var nnDate = new Date();
            var nYear = nnDate.getFullYear();
            var nMonth = nnDate.getMonth();
            var nDate = nnDate.getDate();

            var j = 1;
            for(var i = 1; i < 43; i++){
                if(i === 1){
                    arr.push('<tr>');
                }else{
                    if((i - 1) % 7 === 0){ arr.push('</tr><tr>'); }
                }

                if(i <= startDay){
                    arr.push('<td></td>');
                }

                if(startDay === 0 && i <= 7){
                    arr.push('<td></td>');
                }else{
                    if(i > startDay && j <= dates){
                        if(nYear === targetYear && nMonth === (targetMonth - 1) && j === nDate){
                            arr.push('<td class="enabled on">'+ j +'</td>');
                        }else{
                            arr.push('<td class="enabled">'+ j +'</td>');
                        }
                        j++;
                    }else if(i > dates){
                        arr.push('<td></td>');
                    }
                }
            }

            arr.push('</tr></tbody>');
            table += arr.join("") + '</table>';
            $wrap.find("#cld-body").html(table);
            $wrap.find("span.year").html(targetYear);
            $wrap.find("span.month").html(targetMonth);

            var pm = targetMonth - 1;
            var py = targetYear;
            if(pm === 0){
                py = targetYear - 1;
                pm = 12;
            }
            var prevMonthDates = (new Date(+(new Date(py, pm, 1)) - 86400000)).getDate(); //上月总天数

            var nm = targetMonth + 1;
            var ny = targetYear;
            if(nm === 13){
                ny = targetYear + 1;
                nm = 1;
            }
            var nextMonthDates = (new Date(+(new Date(ny, nm, 1)) - 86400000)).getDate(); //下月总天数

            var $rows = $wrap.find("tbody tr");
            var firstRowTds = $rows.first().find("td").not(".enabled");
            var lastRowTds = $rows.eq(4).find("td").not(".enabled").add($rows.last().find("td").not(".enabled"));

            for(var k = firstRowTds.length - 1; k >= 0; k--){
                firstRowTds.eq(k).html(prevMonthDates);
                prevMonthDates--;
            }

            for(var p = 0; p < lastRowTds.length; p++){
                lastRowTds.eq(p).html(p + 1);
            }

            //设置周六周日的字体颜色
            $rows.each(function(){
                var $cols = $(this).find("td");
                $cols.first().hasClass("enabled") && $cols.first().addClass("happy");
                $cols.last().hasClass("enabled") && $cols.last().addClass("happy");
            });

            config.selectedDate && setSelectedDate($wrap);
        }

        //设置默认选中的日期
        function setSelectedDate($wrap){
            var str = "";
            if(config.selectedDate.constructor != String || isNaN(Date.parse(str = config.selectedDate.replace(/-/g, "/")))){
                alert("默认被选中的日期格式有误. example：2012-12-12");
                return false;
            }

            var ssDate = new Date(Date.parse(str));
            var sYear = ssDate.getFullYear() + "";
            var sMonth = ssDate.getMonth() + 1 + "";
            var sDate = ssDate.getDate() + "";

            if(sYear === $wrap.find("span.year").html() && sMonth === $wrap.find("span.month").html()){
                $wrap.find("td.enabled").each(function(){
                    if($(this).html() === sDate){
                        $(this).addClass("selected");
                    }
                });
            }
        }
    }
})(jQuery);

function echo(settings){
    var defaults = {
        msg: "信息内容",
        title: "提示信息",
        width: 250,
        type: "window", //默认是window弹窗，也可以是tips
        time: false, //自动关闭窗口的时间
        url: false, //必须设置了time才能跳转url
        showBtnConfirm: true,	//是否显示“确定”按钮
        showBtnCancel: true,	//是否显示“取消”按钮
        confirmText: "确定",	//“确定”按钮的文字
        cancelText: "取消",		//“取消”按钮的文字
        closeCallback: function(){},	//当关闭窗口时的回调函数
        confirmCallback: function(){},	//当点击“确定”按钮的回调函数
        cancelCallback: function(){}	//当点击“取消”按钮的回调函数
    };

    if(settings){ extend(defaults, settings)}

    var isIE6 = (function(){
        var userAgent = window.navigator.userAgent.toLowerCase();
        return userAgent.indexOf("msie") !== -1 && userAgent.indexOf("6.0") !== -1;
    })();

    var mask = document.createElement("div");
    mask.className = "dd-mask";
    mask.style.height = Math.max(document.body.offsetHeight, document.documentElement.clientHeight) + "px";

    if(isIE6){
        var iframe = document.createElement("iframe");
        iframe.style.height = mask.style.height;
        iframe.setAttribute("frameBorder", "0");
        mask.appendChild(iframe);
    }

    var boxWrap = document.createElement("div");
    boxWrap.className = "dd-box-wrap";
    boxWrap.id = "dd-box-wrap"

    var box = document.createElement("div");
    box.className = "dd-box";
    box.id = "dd-box";
    box.style.cssText = "width:"+ parseInt(defaults.width) +"px;"

    var sbj = document.createElement("div");
    var btnClose = document.createElement("a");
    var cont = document.createElement("div");
    var btnConfirm = document.createElement("input");
    var btnCancel = document.createElement("input");

    sbj.className = "sbj";
    sbj.innerHTML = "<b>"+ defaults.title +"</b>";
    btnClose.href ="javascript:;";
    btnClose.innerHTML = "&times;";

    btnConfirm.type = "button";
    btnConfirm.value = defaults.confirmText;
    btnConfirm.className = "btn btn-comfirm";

    btnCancel.type = "button";
    btnCancel.value = defaults.cancelText;
    btnCancel.className = "btn btn-cancel";

    cont.className = "cont";
    cont.innerHTML = "<h1>"+ defaults.msg +"</h1>";
    defaults.showBtnConfirm && cont.appendChild(btnConfirm);
    defaults.showBtnCancel && cont.appendChild(btnCancel);

    sbj.appendChild(btnClose);
    box.appendChild(sbj);
    box.appendChild(cont);

    boxWrap.appendChild(box);
    document.body.appendChild(mask);
    document.body.appendChild(boxWrap);

    var top = (document.documentElement.clientHeight - boxWrap.offsetHeight)/2;
    if(!isIE6){
        boxWrap.style.cssText = "top:"+ top +"px;";
    }else{
        boxWrap.style.cssText = "top:"+ ((document.documentElement.scrollTop || document.body.scrollTop) + top) +"px;";
    }

    btnClose.onclick = function(){
        closeWin();
        defaults.closeCallback();
    };

    btnConfirm.onclick = function(){
        closeWin();
        defaults.confirmCallback();
    };

    btnCancel.onclick = function(){
        closeWin();
        defaults.cancelCallback();
    };

    if(defaults.time){
        setTimeout(function(){
            closeWin();
            defaults.closeCallback();
            defaults.url && (location.href = defaults.url);
        }, defaults.time * 1000);
    }

    if(defaults.type === "tips"){
        box.removeChild(sbj);
        !!btnConfirm && btnConfirm.parentNode.removeChild(btnConfirm);
        !!btnCancel && btnCancel.parentNode.removeChild(btnCancel);
        cont.style.paddingBottom = 0;
        cont.style.paddingTop = "10px";
    }

    function extend(a, b){
        for(var key in b)
            if(b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    }

    function closeWin(){
        boxWrap.parentNode.removeChild(boxWrap);
        mask.parentNode.removeChild(mask);
    }

    this.close = closeWin;
    return this;
}


if(!window.Hammer){
    $.holdReady(true);
    $.getScript("http://img.familydoctor.com.cn/scripts/mobile/common/hammer.min.js", function(){
        $.holdReady(false);
    });
}


