document.write("<script src='/service/zhaopinFront/assets/js/aes.js'></script>")

jQuery.support.cors = true;

utils = {
    url:"/service/"
}
baseInfo = {};
//自动保存间隔时间（单位：分钟）
autoSaveTiming = 30;

//登陆是校验密码复杂度(0：不校验 1：先校验复杂度再检查是否正确 2：先检查是否正确再校验复杂度)
isLoginOrCheckpwd = 1;

//qd_n_yq_1(多渠道单院区) qd_n_yq_n(多渠道多院区) qd_1_yq_1(单渠道单院区) qd_1_yq_n(单渠道多院区) 
// baseInfo = {
//     qq:'3047522436',//qq
//     tel:'020-85549399',//电话
//     time:'周一~周五 9:00-18:00',//开放时间
//     unitName:'zsy',//单位名称
//     noticeText:"是否确认申请该职位，一旦申请成功，您的简历信息将不能修改。如有问题请与我们联系(3336718741@qq.com)"//投递提示信息
// }
// 
//获取配置
    $.ajax({
        url: utils.url + "zp/api/sysConfigure?cType=zp&cNum=9",
        type: 'GET',
        async:false,
        headers: {
            'Content-type': 'application/json'
          },
        success:function(res){
            if(res.code==200){
                var result = res.data;
                for(var i = 0; i < result.length;i++){
                    baseInfo[result[i].cKey] = result[i].cValue
                }
            }
        },
        error:function(res){
            if(res.status==0){
                alert("网络请求失败");
            }
        }
    })

//更新头像
if(getCookie('userid')){
    $.ajax({
        url: utils.url + "zp/api/user/getImgurl?token="+getCookie("token"),
        type: 'GET',
        async:false,
        headers: {
            'Content-type': 'application/json'
          },
        success:function(res){
            if(res.code==200){
                res.data = !res.data?"":res.data.replace(/\\/g, "/");
                setCookie("userimg", utils.url + 'zp/api/user/showPhoto?url=' + res.data + "&token=" + getCookie("token"));
            }
        },
        error:function(res){
            if(res.status==0){
                alert("网络请求失败");
            }
        }
    })
}
exam = {
    time:'12月10日上午',
    place:'广州中医药大学三元里校区（机场路12号）'
}

authToken = '';

window.console = window.console || (function () {
    var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
    = c.clear = c.exception = c.trace = c.assert = function () { };
    return c;
})();
/**
 * 获取公共模版
 */
var htmlMap = {
    top	:'/service/zhaopinFront/static/top.html',
    bottom:'/service/zhaopinFront/static/bottom.html',
    topMenu:'/service/zhaopinFront/static/top-menu.html',
    baseInfo:'/service/zhaopinFront/static/base-info.html',
    loginC:'/service/zhaopinFront/static/login-c.html',
    floatWindow:'/service/zhaopinFront/static/float-window.html'
}
function getCommonHtmlContent (obj){
         var pathArr = obj.split(',')
         var returnObj = {};
        for(var i = 0 ; i < pathArr.length ; i++){
                var key = pathArr[i];
                var path = htmlMap[key];
                var htmlContent = '';
                $.ajax({
                    url: path,
                    type: 'GET',
                    async:false,
                    dataType: 'html',
                    success : function (ct){
                        htmlContent = ct
                    }
                });
                returnObj[key] = htmlContent;
        }
        return returnObj;

}

    /**
 * 从URL中获取参数值
 * @param name
 * @returns
 */
function GetQueryString(name) {
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
   var r = window.location.search.substr(1).match(reg); //真实环境请用这句
   if (r!=null) return (r[2]); return null;
}

/**
 * cookie
 */
function setCookie(name,value){
        var Days = 0.1;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
}
//删除cookies 
function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 
//返回系统配置的值
function returnSysConfigVal(configKey) {
    var sysConfigVal = '';
    $.ajax({
        url: utils.url + "sys/iParam",
        type: 'GET',
        async:false,
        headers: {
            'Content-type': 'application/json'
          },
        success:function(res){
            if(res.code==200){
                var sysConfig = res.data; //登录获取的sys系统设置
                
                $.each(sysConfig,function(index,item){
                    if(item['paramKey'] == configKey){
                        sysConfigVal = item['paramValue'];
                        return false;
                    }
                });
                
            }
        },
        error:function(res){
            if(res.status==0){
                alert("网络请求失败");
            }
        }
    })
    return sysConfigVal;
    
};
//加密
function encrypt(word,k){
    if(k || returnSysConfigVal('FRONT_ENCRYPT_KEY')){
        var paramValue = k || returnSysConfigVal('FRONT_ENCRYPT_KEY');
        var key = CryptoJS.enc.Utf8.parse(paramValue);
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
        return encrypted.toString();
    }else{
        return word;
    };
};



// function $(obj) {
//     return document.getElementById(obj);
// }

var skin = {};

skin.addEvent = function () {
    var skins = $("#skin").find("li");
    for (i = 0; i < skins.length; i++) {
        skins[i].onclick = function () {skin.setSkin($(this).attr("color"));window.location.reload();};
    }
}


skin.setSkin = function (color) {
    color = encodeURI(color);
    setCookie("color",color);
}

window.onload = function(){
    skin.addEvent();
    
}

function setSkinColor(){
    var colorList = decodeURI(getCookie('color'));
    var changeColor = eval("("+colorList+")");
    $("body").find(".mainColor").css("background-color",changeColor.mainColor);
}

function toResume(){
    var zpqd = getCookie("zpqd");
    if(window.location.pathname=='/service/zhaopinFront/inviteJob.html'&&zpqd=='all'){
        setCookie("zpqd",getZPQDfirst());
        window.location.href="/service/zhaopinFront/resume_1.html";
    }else if(window.location.pathname=='/service/zhaopinFront/inviteJob.html'&&!zpqd){
        setCookie("zpqd",getZPQDfirst());
        window.location.href="/service/zhaopinFront/resume_1.html";
    }else{
        window.location.href="/service/zhaopinFront/resume_1.html";
    }
    
}
function toPreview(){
    var zpqd = getCookie("zpqd");
    if(window.location.pathname=='/service/zhaopinFront/resume_1.html'){
        if(confirm("请确认是否已提交简历，未提交简历将清空所填内容，是否继续？")){
            window.location.href="/service/zhaopinFront/preview.html";
        }else{
            return;
        }
    }else if(window.location.pathname=='/service/zhaopinFront/inviteJob.html'&&zpqd=='all'){
        setCookie("zpqd",getZPQDfirst());
        window.location.href="/service/zhaopinFront/preview.html";
    }else if(window.location.pathname=='/service/zhaopinFront/inviteJob.html'&&!zpqd){
        setCookie("zpqd",getZPQDfirst());
        window.location.href="/service/zhaopinFront/preview.html";
    }else{
        window.location.href="/service/zhaopinFront/preview.html";
    }
    
}
function toCenter(){
    var zpqd = getCookie("zpqd");
    if(window.location.pathname=='/service/zhaopinFront/resume_1.html'){
        if(confirm("请确认是否已提交简历，未提交简历将清空所填内容，是否继续？")){
            window.location.href="/service/zhaopinFront/deliverCenter.html";
        }else{
            return;
        }
    }else if(window.location.pathname=='/service/zhaopinFront/inviteJob.html'&&zpqd=='all'){
        setCookie("zpqd",getZPQDfirst());
        window.location.href="/service/zhaopinFront/deliverCenter.html";
    }else if(window.location.pathname=='/service/zhaopinFront/inviteJob.html'&&!zpqd){
        setCookie("zpqd",getZPQDfirst());
        window.location.href="/service/zhaopinFront/deliverCenter.html";
    }else{
        window.location.href="/service/zhaopinFront/deliverCenter.html";
    }
}



function getZPQDfirst(){
    var firstZPQD = null;
    $.ajax({
        url: utils.url + "zp/api/readCodeItem?codeTypeId=PATH",
        type: 'GET',
        async:false,
        headers: {
            'Content-type': 'application/json'
          },
        success:function(res){
            if(res.code==200){
                var pathList = res.data;
                firstZPQD = res.data[0].CODETERMID;
            }
        },
        error:function(res){
            if(res.status==0){
                alert("网络请求失败");
            }
        }
    })
    return firstZPQD;
}

function isValidate(){
    var url = utils.url + 'sys/iParam';
    var isValidateCode = false;
    $.ajax({
        url: url,
        type: 'GET',
        async:false,
        headers: {
            'Content-type': 'application/json'
          },
        success:function(res){
            if(res.code==200){
                var dataList = res.data || [];
                $.each(dataList,function(index,item){
                    if(item['paramKey']=='LOGIN_VALI_CODE'&&item['paramValue']==1){
                        isValidateCode = true;
                    }else{
                        isValidateCode = false;
                    }
                });
            }
        },
        error:function(res){
            if(res.status==0){
                alert("网络请求失败");
            }
        }
    })
    return isValidateCode;
}

function login(){
    var username = $("#login-username").val();
    var password = $("#login-pwd").val();
    if(!username){
        alert("请输入用户名");
        return;
    }
    if(!password){
        alert("请输入密码");
        return;
    }
    // var pwdPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    // var pwdPattern = /^(?![a-zA-Z]{10,}$)(?![a-z\d]{10,}$)(?![a-z!@#\$%]{10,}$)(?![A-Z\d]{10,}$)(?![A-Z!@#\$%]{10,}$)(?![\d!@#\$%]{10,}$)[a-zA-Z\d!@#\$%]{10,}$/;
    var pwdPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}$/;
    if(isLoginOrCheckpwd==1){
        if(password!=''&&!pwdPattern.test(password)){
            if(confirm('你的密码过于简单，请前往修改密码(至少10位密码，必须包含大小写字母和数字的组合，可以使用特殊字符)')){
                window.location.href="/service/zhaopinFront/forget.html";
                return;
            }
            return;
        }
    }
    
    // var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;//用户名正则
    // if(!uPattern.test(username)){
    //     return;
    // }
    var postData = {
        username:encrypt(username),
        password:encrypt(hex_md5(password))
    }
    if(isValidate()){
        postData.valiCode = $("#validate").val()||'';
        postData.uuId = getCookie("codeImgUuid")||''
    }
    postData = JSON.stringify(postData);
    $.ajax({
        url: utils.url + 'zp/api/login',
        type: 'POST',
        data: postData,
        headers: {
            'Content-type': 'application/json'
          },
        success:function(res){
            if(res.code==200){
                setCookie("token", res.token);
                setCookie("userid", res.userid);
                setCookie("zpid", res.zpid);
                setCookie("username", res.username);
                setCookie("userimg", utils.url + 'zp/api/user/showPhoto?url=' + res.url + "&token=" + res.token);
                setCookie("userphone", username);
                setCookie("ckaddress", res.ckaddress);
                setCookie("cktime", res.cktime);
                setCookie("userread", res.userRead);
                if(isLoginOrCheckpwd==2){
                    if(password!=''&&!pwdPattern.test(password)){
                        if(confirm('你的密码过于简单，请前往修改密码(至少10位密码，必须包含大小写字母和数字的组合，可以使用特殊字符)')){
                            window.location.href="/service/zhaopinFront/forget.html";
                            return;
                        }
                        return;
                    }
                }
                window.location.reload();
                
            }else{
                if(isValidate()){
                    var uuId = creatGuid();
                    setCookie("codeImgUuid",uuId);
                    $("#codeImg").attr("src",utils.url + "loginValidateCode?uuId=" + uuId);
                    $("#validate").val("");
                }
                alert(res.msg);
            }
            
        },
        error:function(res){
            console.log(JSON.stringify(res))
            if(res.status==0){
                alert("网络请求失败");
            }
        }
    })
    
}

function loginout(){
    var token = getCookie("token");
    var postData = {
        token:token
    }
    postData = JSON.stringify(postData);
    $.ajax({
        url: utils.url + 'zp/api/logout',
        type: 'POST',
        data: postData,
        headers: {
            'Content-type': 'application/json'
          },
        success:function(res){
            if(res.code==200){
                delCookie("token");
                delCookie("userid");
                delCookie("zpid");
                delCookie("username");
                delCookie("userimg");
                delCookie("userphone");
                // delCookie("zpqd");
                delCookie("ckaddress");
                delCookie("cktime");
                delCookie("userread");
                
                if(window.location.pathname=='/service/zhaopinFront/resume_1.html'||window.location.pathname=="/service/zhaopinFront/resumeFlow.html"||window.location.pathname=="/service/zhaopinFront/deliverCenter.html"||window.location.pathname=='/service/zhaopinFront/preview.html'){
                    
                    var onlyone = getCookie("onlyone");
                    
                    if(onlyone==1){
                        // delCookie("onlyone");
                        window.location.href="/service/zhaopinFront/inviteJob.html";
                    }else{
                        // delCookie("onlyone");
                        setCookie("zpqd", 'all');
                        window.location.href="/service/zhaopinFront/inviteJob_1.html";
                    }
                }else{
                    window.location.reload();
                } 
                
            }
            
        },
        error:function(res){
            console.log(JSON.stringify(res))
            if(res.status==0){
                alert("网络请求失败");
            }
        }
    })
}

//获取窗口可视高度
function getClientHeight()
{
  var clientHeight=0;
  if(document.body.clientHeight&&document.documentElement.clientHeight)
  {
  var clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
  }
  else
  {
  var clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
  }
  return clientHeight;
}

// 时间戳转换
function timestampToTime(timestamp) {
    var date;
    var timestampStr = String(timestamp);
    if (timestampStr.length == 13) {
        date = new Date(timestamp);
    } else {
        date = new Date(timestamp * 1000);
    } //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + mm + s;
}

//计算时间间隔
function GetDateDiff(startDate,endDate)  
{  
    var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
    var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
    var dates = Math.abs((startTime - endTime))/(1000*60*60*24);     
    return  dates;    
}

//获取招聘多媒体附件子集名称
function getFjField(){
    var fjField = "";
    $.ajax({
        url: utils.url + 'zp/api/sysConfigure?cType=zp&cNum=15',
        type: 'GET',
        async: false,
        headers: {
            'Content-type': 'application/json'
          },
        success:function(res){
            if(res.code==200){
                var result = res.data;
                for(var i = 0; i < result.length; i++){
                    if(result[i].cKey=='zpAccUploadTable'){
                        fjField = result[i].cValue;
                    }
                }
                
            }
            
        }
    })

    return fjField;
}

String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

function creatGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function renderAge(str){
    var newStr = "";
    if(str.indexOf("≥")!=-1){
        newStr = str.replace("≥","") + "岁及以上";
    }
    else if(str.indexOf("≤")!=-1){
        newStr = str.replace("≤","") + "岁及以下";
    }
    else if(str.indexOf(">")!=-1){
        newStr = str.replace(">","") + "岁以上";
    }
    else if(str.indexOf("<")!=-1){
        newStr = str.replace("<","") + "岁以下";
    }
    else if(str.indexOf("=")!=-1){
        newStr = str.replace("=","") + "岁";
    }
    else{
        newStr = str;
    }
    return newStr;
}

function setColorFun(){
    var storageColor = getCookie("skinColor")||'#12A37A';
    setCookie("skinColor",storageColor);
        setTimeout(function(){
            $(".left-menu .common.active").css("background-color",storageColor);
            // $(".left-menu .common:hover").css("background-color",storageColor);
            $("#top-menu").css("background-color",storageColor);
            $("#top-menu li.active").css("color",storageColor);
            $(".right-wrapper .wrapper-title").css("background-color",storageColor);
            $(".login-con .login-btn input[type='button']").css("background-color",storageColor);
            $(".login-con .handle a").css("color",storageColor);
            $(".right-wrapper .wrapper-menu").css("color",storageColor);
            $(".right-wrapper .wrapper-menu .menu-item.active").css("border-bottom","2px solid " + storageColor);
            $(".whj_jqueryPaginationCss-1 .whj_border").css("border","1px solid " + storageColor);
            $(".whj_jqueryPaginationCss-1 .whj_checked").css("background-color",storageColor);
            $(".app-top .top-btn a").css("color",storageColor);
            $(".app-top .loginBtn a").css("color",storageColor);
            $(".company-info .tips").css("color",storageColor);
            $("#uploadBtn").css("color",storageColor);
            $("#resume_1-content .resume-wrapper .tit").css("color",storageColor);
            $("#submit-con input").css("background-color",storageColor);
            $("#save-con input").css("background-color",storageColor);
            $(".person-info .logout a").css("color",storageColor);
            $("#openFillBtn").css("color",storageColor);
            $(".app-bottom").css("background-color",storageColor);
            $("#resume_1-content .resume-wrapper").css("border-bottom","1px solid " + storageColor);
            $(".login-box .login-btn").css("background-color",storageColor);
            $(".login-box .login-item input[type='button']").css("color",storageColor);
            $("#mask-cover .inner-con .title").css("background-color",storageColor);
            // $(".job-list .item-body p").css("color",storageColor);
            // $(".job-list .list-body a").css("background-color",storageColor);
            // $(".job-list .list-body.on").css("color",storageColor);
            // $(".job-list .list-body a.watch").css("background-color",storageColor);
            $(".right-wrapper .wrapper-menu .menu-item.active").css("border-bottom","2px solid " + storageColor);
            var loginTitle = $(".login-con .title").length!=0 ? $(".login-con .title").css("background-image") : '';
            if(loginTitle.indexOf("color-")!=-1 && storageColor){
                var newStorageColor = storageColor.replace("#","");
                loginTitle = loginTitle.replace('12A37A',newStorageColor);
                loginTitle = loginTitle.replace('004FA8',newStorageColor);
                loginTitle = loginTitle.replace('0075CD',newStorageColor);
                $(".login-con .title").css("background-image",loginTitle);
            }

            setIconChange();

            var allImg = $("img");
            for(var i = 0; i < allImg.length; i++){
                
                var src = $(allImg).eq(i).attr("src");
                // console.log(src)
                if(src.indexOf("color-")!=-1){
                    var newStorageColor = storageColor.replace("#","");
                    src = src.replace('12A37A',newStorageColor);
                    src = src.replace('004FA8',newStorageColor);
                    src = src.replace('0075CD',newStorageColor);
                    $(allImg).eq(i).attr("src",src);
                }
            }

            // $("#instruction .inner .handle button").css("background-color",storageColor);
            $(".info-list tbody tr").mouseover(function(){
                $(this).find(".color").css("color",storageColor);
                $(this).css("color",storageColor);
            });
            $(".info-list tbody tr").mouseleave(function(){
                $(this).find(".color").css("color","#666");
                $(this).css("color","#666");
            });
            $(".left-menu .common").mouseover(function(){
                $(this).css("background-color",storageColor);
                $(this).css("color","#fff");
                $(this).css("margin","0");
            });
            $(".left-menu .common").mouseleave(function(){
                if($(this).hasClass('active')){return;}
                $(this).css("background-color","#fff");
                $(this).css("color","#000");
                $(this).css("margin","0,10px");
            });
            $("#leftMenu li").mouseover(function(){
                $(this).css("color",storageColor);
            });
            $("#leftMenu li").mouseleave(function(){
                $(this).css("color","#000");
            });
            $("#top-menu li").mouseover(function(){
                $(this).css("color",storageColor);
                var imgSrc = $(this).find("img").attr("src");
                // var newStorageColor = storageColor.replace("#","");
                // imgSrc = imgSrc.replace("/img","/img/color-"+newStorageColor)
                // $(this).find("img").attr("src",imgSrc);
            });
            $("#top-menu li").mouseleave(function(){
                if($(this).hasClass('active')){return;}
                var imgSrc = $(this).find("img").attr("src");
                $(this).css("color","#fff");
            });
            $("#mask-cover .wish-sel-con li").mouseover(function(){
                $(this).css("background-color",storageColor);
            });
            $("#mask-cover .wish-sel-con li").mouseleave(function(){
                if($(this).hasClass('active')){return;}
                $(this).css("background-color","#eff5f7");
            });
        },100)
}
setColorFun();

function setIconChange(){
    var storageColor = getCookie("skinColor")||'#12A37A';
    var resumeIconAdd = $(".main-con-2-table td .icon-add").length!=0 ? $(".main-con-2-table td .icon-add").css("background-image") : '';
            if(resumeIconAdd.indexOf("color-")!=-1 && storageColor){
                var newStorageColor = storageColor.replace("#","");
                resumeIconAdd = resumeIconAdd.replace('12A37A',newStorageColor);
                resumeIconAdd = resumeIconAdd.replace('004FA8',newStorageColor);
                resumeIconAdd = resumeIconAdd.replace('0075CD',newStorageColor);
                $(".main-con-2-table td .icon-add").css("background-image",resumeIconAdd);
            }

            var resumeIconDelete = $(".main-con-2-table td .icon-delete").length!=0 ? $(".main-con-2-table td .icon-delete").css("background-image") : '';
            if(resumeIconDelete.indexOf("color-")!=-1 && storageColor){
                var newStorageColor = storageColor.replace("#","");
                resumeIconDelete = resumeIconDelete.replace('12A37A',newStorageColor);
                resumeIconDelete = resumeIconDelete.replace('004FA8',newStorageColor);
                resumeIconDelete = resumeIconDelete.replace('0075CD',newStorageColor);
                $(".main-con-2-table td .icon-delete").css("background-image",resumeIconDelete);
            }

            var resumeIconUpload = $(".main-con-2-table td .icon-upload").length!=0 ? $(".main-con-2-table td .icon-upload").css("background-image") : '';
            if(resumeIconUpload.indexOf("color-")!=-1 && storageColor){
                var newStorageColor = storageColor.replace("#","");
                resumeIconUpload = resumeIconUpload.replace('12A37A',newStorageColor);
                resumeIconUpload = resumeIconUpload.replace('004FA8',newStorageColor);
                resumeIconUpload = resumeIconUpload.replace('0075CD',newStorageColor);
                $(".main-con-2-table td .icon-upload").css("background-image",resumeIconUpload);
            }

            var resumeIconDownload = $(".main-con-2-table td .icon-download").length!=0 ? $(".main-con-2-table td .icon-download").css("background-image") : '';
            if(resumeIconDownload.indexOf("color-")!=-1 && storageColor){
                var newStorageColor = storageColor.replace("#","");
                resumeIconDownload = resumeIconDownload.replace('12A37A',newStorageColor);
                resumeIconDownload = resumeIconDownload.replace('004FA8',newStorageColor);
                resumeIconDownload = resumeIconDownload.replace('0075CD',newStorageColor);
                $(".main-con-2-table td .icon-download").css("background-image",resumeIconDownload);
            }

            var caretICon = $("#resume_1-content .main-con-1 .main-con-1-list>li .bootstrap-select .caret").length!=0 ? $("#resume_1-content .main-con-1 .main-con-1-list>li .bootstrap-select .caret").css("background-image") : '';
            if(caretICon.indexOf("color-")!=-1 && storageColor){
                var newStorageColor = storageColor.replace("#","");
                caretICon = caretICon.replace('12A37A',newStorageColor);
                caretICon = caretICon.replace('004FA8',newStorageColor);
                caretICon = caretICon.replace('0075CD',newStorageColor);
                $("#resume_1-content .main-con-1 .main-con-1-list>li .bootstrap-select .caret").css("background-image",caretICon);
            }

            var dateICon = $("#resume_1-content .main-con-1 .main-con-1-list>li .icon-date").length!=0 ? $("#resume_1-content .main-con-1 .main-con-1-list>li .icon-date").css("background-image") : '';
            if(dateICon.indexOf("color-")!=-1 && storageColor){
                var newStorageColor = storageColor.replace("#","");
                dateICon = dateICon.replace('12A37A',newStorageColor);
                dateICon = dateICon.replace('004FA8',newStorageColor);
                dateICon = dateICon.replace('0075CD',newStorageColor);
                $("#resume_1-content .main-con-1 .main-con-1-list>li .icon-date").css("background-image",dateICon);
            }

            var caretIcon = $(".right-wrapper .wrapper-title .title .bootstrap-select .caret").length!=0 ? $(".right-wrapper .wrapper-title .title .bootstrap-select .caret").css("background-image") : '';
            if(caretIcon.indexOf("color-")!=-1 && storageColor){
                var newStorageColor = storageColor.replace("#","");
                caretIcon = caretIcon.replace('12A37A',newStorageColor);
                caretIcon = caretIcon.replace('004FA8',newStorageColor);
                caretIcon = caretIcon.replace('0075CD',newStorageColor);
                $(".right-wrapper .wrapper-title .title .bootstrap-select .caret").css("background-image",caretIcon);
            }

            var dateICon_2 = $(".main-con-2-table td .icon-date").length!=0 ? $(".main-con-2-table td .icon-date").css("background-image") : '';
            if(dateICon_2.indexOf("color-")!=-1 && storageColor){
                var newStorageColor = storageColor.replace("#","");
                dateICon_2 = dateICon_2.replace('12A37A',newStorageColor);
                dateICon_2 = dateICon_2.replace('004FA8',newStorageColor);
                dateICon_2 = dateICon_2.replace('0075CD',newStorageColor);
                $(".main-con-2-table td .icon-date").css("background-image",dateICon_2);
            }

            var caretIcon_2 = $(".main-con-2-table td .bootstrap-select .caret").length!=0 ? $(".main-con-2-table td .bootstrap-select .caret").css("background-image") : '';
            if(caretIcon_2.indexOf("color-")!=-1 && storageColor){
                var newStorageColor = storageColor.replace("#","");
                caretIcon_2 = caretIcon_2.replace('12A37A',newStorageColor);
                caretIcon_2 = caretIcon_2.replace('004FA8',newStorageColor);
                caretIcon_2 = caretIcon_2.replace('0075CD',newStorageColor);
                $(".main-con-2-table td .bootstrap-select .caret").css("background-image",caretIcon_2);
            }
}

function historyGoBack(){
    window.history.go(-1);
}

function toResume(){
    if(!getCookie("token")){
        alert("请登录后再填写简历");
    }else{
        window.location.href="/service/zhaopinFront/resume_1.html";
    }
}

// 跳转简历界面
function goResume(){    
    var token = getCookie("token");
    if (token) {
        window.location.href="/service/zhaopinFront/resume_1.html";
    }else{
        alert('未登录！')
    }
}
    
function goInviteJob(){
    setCookie("zpqd", 'all');
    window.location.href="/service/zhaopinFront/inviteJob_1.html";
}
$(function(){
    // var pathname = window.location.pathname
    // if(!getCookie('userid')&&pathname="/login.html"){
    //     window.location.href="/login.html";
    //     return;
    // }
    $(".left-menu a").mouseenter(function(){
        if($(this).hasClass('now')){
            return;
        }
        // $(this).addClass("active");
        var imgName = $(this).find("img").attr("src");
        imgName = imgName.substring(0,57);
        $(this).find("img").attr("src",imgName+'-active.png');
    })
    $(".left-menu a").mouseleave(function(){
        if($(this).hasClass('now')){
            return;
        }
        var imgName = $(this).find("img").attr("src");
        imgName = imgName.substring(0,57);
        $(this).find("img").attr("src",imgName+'.png');
        $(this).removeClass("active");
    })

    
    if(getClientHeight()>900){
        pageSize = 15;
        $('.right-wrapper').css("min-height",'624px');
        $("#resume_1-content").css("min-height",'723px');
        $(".company-info").css("min-height",'230px');
        $("#tips-info").css("min-height",'420px');
    }else{
        pageSize = 9;
        $('.right-wrapper').css("min-height",'360px');
        $("#resume_1-content").css("min-height",'543px');
        $(".company-info").css("min-height",'234px');
        $("#tips-info").css("min-height",'415px');
    }

    // document.onkeydown = function (event) {

    //     var token = getCookie("token");
    //     var e = event || window.event;
    //     if (e && e.keyCode == 13 &&!token) {
    //            login(); 
            
            
    //     }
    // };
})