/**
 * Created by ZhuXueSong on 2017/6/27.
 */
var is_checked = false;
/********* 请求特卖活动 start *********/
requestData("special.htm", {}, function (data) {
    if (data.success != true) {
        show_alert(data.msg);
        return false;
    }
    data = data.data;
    var nav_html = "";
    var time = get_date("", true);
    $.each(data, function (i, v) {
        var text = "";
        var check = "";
        var isUp = 0;
        var isFirst = false;
        if (v.beginTime <= time && v.endTime > time) {
            if (!is_checked) {
                check = "checked";
                isFirst = is_checked = true;
                $(".limit_banner > img").attr("src", config.imageUrl + v.image);
            }
            text = '秒杀进行中';
            isUp = 1;
        } else if (v.endTime <= time) {
            text = '秒杀结束';
            isUp = -1;
        } else {
            text = '即将开始';
            isUp = 0;
        }
        nav_html += '<span onclick="selectThis(this);" class="' + check + '" data-type="' + v.id + '" data-image="' + v.image + '" onerror="this.src=\'images/none-image.png\'"><em>' + v.beginTime.substr(11, 5) + '</em><em>' + text + '</em></span>';
        setGoodsList(v, isUp, isFirst);
        isFirst = false;
    });
    $("#buy_limit_head_box").html(nav_html);
}, false);
/********* 请求特卖活动 end *********/

/********* 计算导航宽度 start *********/
window.onload = function () {
    var spanNum = $("#buy_limit_head span").length;
    $("#buy_limit_head_box").css("width", spanNum * 1.28 + "rem");
};
/********* 计算导航宽度 end *********/

/**
 * 头部右侧更多按钮的显示与影藏
 */
function showMore() {
    var obj = $(".show-more");
    if (obj.hasClass("h")) {
        obj.removeClass("h").hide(150);
    } else {
        obj.addClass("h").show(150);
    }
}

/**
 * 向body中添加特卖商品
 * @param data
 * @param isUp
 * @param is_checked
 */
function setGoodsList(data, isUp, is_checked) {
    //计算结束时间
    var time = new Date();
    if (isUp == 1) {
        var endTime = new Date(data.endTime.replace("-", "/")) - time;
        var endTime1 = getEndTime(endTime);
        var display = !is_checked ? 'style="display: none;"' : '';
        var html = '<div class="this-content" id="content_' + data.id + '" ' + display + '> <div class="buy_limit_title"> <i></i> <em>限时疯狂抢购</em> <span>本场结束还有：<em id="endTime_' + data.id + '" data-time="' + endTime + '">' + endTime1 + '</em></span></div><div class="buy_limit_goods_lists">';
    } else if (isUp == 0) {
        var starTime = new Date(data.beginTime.replace("-", "/")) - time;
        var starTime1 = getEndTime(starTime);
        var html = '<div class="this-content" id="content_' + data.id + '" style="display: none;"> <div class="buy_limit_title"> <i></i> <em>限时疯狂抢购</em> <span>本场开始还有：<em id="starTime_' + data.id + '" data-time="' + starTime + '">' + starTime1 + '</em></span></div><div class="buy_limit_goods_lists">';
    } else {
        var html = '<div class="this-content" id="content_' + data.id + '" style="display: none;"> <div class="buy_limit_title"> <i></i> <em>限时疯狂抢购</em> <span>抢购已结束</span></div><div class="buy_limit_goods_lists">';
    }
    $.each(data.apiSpecialGoods, function (i, v) {      //<span class="btn scare_btn" onclick="redirect(\'dilemu/goodsdetail.html?goods_id=' + v.goods_id + '\')">立即抢购&nbsp;〉</span>
        html += '<div class="buy_limit_goods"> <img src="' + config.imageUrl + v.mainPhotoPath + '" alt=""> <div class="re_right"> <h1>' + v.goods_name + '</h1> <h2>' + v.summary + '</h2> <h3>已抢' + v.sale + '件</h3> <h4>￥' + v.special_price + ' <em>￥' + v.goods_price + '</em></h4> <h5><em style="width: '+ v.percent +'"></em><span>剩余 '+ v.percent +'</span></h5> ' + (isUp == 1 ? '<span class="btn scare_btn" onclick="redirect(\'goodsdetail.html?id=' + v.goods_id + '\')">立即抢购&nbsp;〉</span>' : '') + ' </div> </div>';
    });
    $("body").append(html);
    var map = [];
    if (isUp == 1) {
        map[data.id] = setInterval(function () {
            var obj = $("#endTime_" + data.id);
            var e_time = parseInt(obj.attr("data-time"));
            e_time -= 1000;
            obj.html(getEndTime(e_time)).attr("data-time", e_time);;
            if (e_time <= 0) {
                location.reload();
                clearInterval(map[data.id]);
            }
        }, 1000);
    } else if (isUp == 0) {
       map[data.id] = setInterval(function () {
            var obj = $("#starTime_" + data.id);
            var e_time = parseInt(obj.attr("data-time"));
            e_time -= 1000;
            obj.html(getEndTime(e_time)).attr("data-time", e_time);;
            if (e_time <= 0) {
                location.reload();
                clearInterval(map[data.id]);
            }
        }, 1000);
    }
}

/**
 * 根据毫秒数计算剩余时间  H:i:s
 * @param time
 * @return {string}
 */
function getEndTime(time) {
    time = parseInt(time / 1000);
    return formatTime(parseInt(time/3600)) + ":" + formatTime(parseInt((time%3600)/60)) + ":" + formatTime(time%60);
}

/**
 * 时间格式化
 * @param time
 * @return {string}
 */
function formatTime(time) {
    return time > 9 ? time : "0" + time;
}


function selectThis(obj) {
    obj = $(obj);
    var id = obj.attr("data-type");
    var img = obj.attr("data-image");
    if (obj.hasClass("checked")) {
        return false;
    }
    $(".limit_banner > img").attr("src", config.imageUrl + img);
    obj.addClass("checked").siblings("span").removeClass("checked");
    $(".this-content").hide();
    $("#content_" + id).show();
}