/**
 * Created by ZhuXueSong on 2017/6/26.
 */
var param = get_param();
getThisData();
function getThisData() {
    if (!checkLogin(false)) {
        return false;
    }
    requestData("getHsGrouped.htm", {order_id: param.id}, function (data) {
        if (!data.success) {
            show_alert(data.msg);
            return false;
        }
        data = data.data;
        //收货地址
        $(".orders-info-address h1").html(data.apiAddress.trueName + " &nbsp; " + data.apiAddress.mobile);
        var area = data.apiAddress.area;
        $(".orders-info-address h2").html(area.parent.parent.areaName + " " + area.parent.areaName + " " + area.areaName + " " + data.apiAddress.area_info);
        $(".order-info-content").html(getOrderinfo(data));
        addAllUserHeader(data);

        var timesHtml = '<h1>订单编号：' + param.id + '</h1>';
        timesHtml += '<h2>创建时间：' + data.addTime + '</h2>';
        if (data.endTime) {
            timesHtml += '<h2>完成时间：' + data.endTime + '</h2>';
        }
        $(".order-info-log").html(timesHtml);
    });
}

function getOrderinfo(v) {
    var htm = '<div class="order_body">' +
        '<div class="orderGoodsContent">' + getOrderInfoGoods(v) + '</div>' +
        '<div class="order-info-fee">' +
        '<h1>实付款：￥' + formatPrice(v.totalPrice) + '（含运费￥' + formatPrice(v.ship_price) + '）</h1>' +
        '</div>' +
        '</div>';
    return htm;
}

function getOrderInfoGoods(v) {
    var html = '';
    if (!v) {
        return html;
    }
    var url = 'group_buy_info.html?id=' + v.order_id;
    html = '<div class="order_goods" onclick="redirect(\'' + url + '\')">' +
        '<img src="' + config.imageUrl + v.mainPhotoPath + '" alt="" onerror="this.src=\'images/none-image.png\'">' +
        '<div class="order_goods_right">' +
        '<h1>' + v.goods_name + '</h1>' +
        '<h2>' + v.spec_info + '</h2>' +
        '<h3 style="color: #E0696D"><em>￥' + formatPrice(v.price) + '</em>' + v.count + '人成团</h3>' +
        '</div>' +
        '</div>';
    return html;
}

function addAllUserHeader(v) {
    var html = "";
    var hsUsers = v.hsUsers;
    for (var i = 0; i < v.count; i++) {
        if (hsUsers[i]) {
            html += '<div class="group-head"><img src="' + hsUsers[i].avatarUrl + '" onerror="this.src=\'images/orders/group-head1@2x.png\'"/></div>';
        } else {
            html += '<div class="group-head"></div>';
        }
    }
    $(".hsUserBox").html(html);
    //平团状态
    if (v.order_status == 20) {
        $(".icon-group-result").addClass("success");
        $(".group-buy-result span").html("恭喜您，拼团成功");
    } else if (v.order_status == 21) {
        $(".icon-group-result").html("拼团中").css("border-style", "dashed");
        $(".group-buy-result span").html("距离拼团结束还剩");
        //倒计时
        var nowTime = new Date();
        var endTime = new Date(v.endTime.replace(/\-/g, "/")) - nowTime;
        $(".group-buy-result h1").html(getEndTime(endTime));
        var set = setInterval(function () {
            endTime -= 1000;
            $(".group-buy-result h1").html(getEndTime(endTime));
            if (endTime <= 0) {
                history.go(0);
            }
        }, 1000);
    } else if (v.orderStatus == 22) {
        $(".icon-group-result").addClass("fail");
        $(".group-buy-result span").html("很抱歉，拼团失败");
    } else {
        $(".icon-group-result").addClass("success");
        $(".group-buy-result span").html("恭喜您，拼团成功");
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