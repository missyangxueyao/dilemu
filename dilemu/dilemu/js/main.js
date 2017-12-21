/**
 * Created by yangxueyao on 2017/4/6.
 */
new function (){
    var _self = this;
    _self.width = 640;//设置默认最大宽度
    _self.fontSize = 100;//默认字体大小
    _self.widthProportion = function(){
        var p =(document.body&&document.body.clientWidth||document.getElementsByTagName("html")[0].offsetWidth)/_self.width;return p>1?1:p<0.5?0.5:p;};
    _self.changePage = function(){        document.getElementsByTagName("html")[0].setAttribute("style","font-size:"+_self.widthProportion()*_self.fontSize+"px");
    }
    _self.changePage();    window.addEventListener('resize',function(){_self.changePage();},false);};



/****************************/
/*msg提示信息
 * qnmlgb是否刷新
 * local_url跳转地址
 */
function show_alert(msg,qnmlgb,local_url){
    var html = '<div class="alert_dialog"><div class="show_alert">' + msg + '</div></div>';
    $("body").append(html);//讲动态创建的html标签添加到网页
    var i = 0;
    var setI = setTimeout(function(){
        $(".alert_dialog").remove();
        if(qnmlgb == true){
            history.go(0);//history.go(0)刷新   history.go(1)前进    history.go(-1)后退
        }
        if(local_url !="" && local_url !=undefined){
            get_url(local_url);
        }
        if (i>=1){
            clearTimeout(setI);
        }
        i++;
    },1000);


}
//获取跳转路径
function get_url(url){
    window.location.href = url;
}



/**
 *
 * 返回上一页并刷新
 */
function getBackShuaXin(){
    location.reload();
    history.back();
}

/**
 * 拼接图片地址
 * @param string
 * @returns {object}
 */
function getImagesList(string) {
    var arr = string.split(";");
    $.each(arr, function(i, v){
        arr[i] = config.imageUrl + v;
    });
    return arr;
}

/**
 * 时间戳转换
 * @param time 到秒的时间戳,如果穿传空,则为当前时间
 * @param his 是否到时分秒
 * @returns {string}
 */
function get_date(time, his){
    if(time != "") {
        time = new Date(time * 1000);
    } else {
        time = new Date();
    }
    var year = time.getFullYear();
    var month = parseInt(time.getMonth()) + 1;
    var day = time.getDate();
    month = (month>=10)?month:"0"+month;
    day = (day>=10)?day:"0"+day;
    if(his == true){
        var hours = time.getHours();
        hours = (hours>=10)?hours:"0"+hours;
        var min = time.getMinutes();
        min = (min>=10)?min:"0"+min;
        var sen = time.getSeconds();
        sen = (sen>=10)?sen:"0"+sen;
        return year+'-'+month+'-'+day+' '+hours+':'+min+':'+sen;
    }else{
        return year+'-'+month+'-'+day;
    }
}

/**
 * 是否存在上一步, 存在则返回, 否则跳转到首页
 */
function getReferrer() {
    if(document.referrer == ""){
        redirect("product_list.html", true);
    } else {
        history.back();
    }
}


/**
 * 判断是否是微信浏览器
 * @returns {boolean}
 */
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
