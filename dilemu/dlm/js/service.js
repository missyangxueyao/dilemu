/**
 * Created by ZhuXueSong on 2017/6/27.
 */
var orderGoods = sessionStorage.getItem("orderGoods");
var param = get_param();
var checkIds = {};
if (orderGoods == "" || !param.id) {
    show_alert_back("订单不存在");
} else {
    orderGoods = JSON.parse(orderGoods);
    if (param.status == 30) {
        $("#trade_goods").remove();
    }
    $(".right_content").html(getOrderGoodsHtml(orderGoods));
}

function checkedThis(obj) {
    obj = $(obj);
    var key = obj.attr("data-key");
    if (obj.hasClass("checked")) {
        obj.removeClass("checked");
        checkIds[key] = 0;
    } else {
        obj.addClass("checked");
        checkIds[key] = 1;
    }
}

function getOrderGoodsHtml(list) {
    if (!checkLogin(false)) {
        return false;
    }
    var html = '';
    $.each(list, function (i, v) {
       html += '<div class="order_goods">' +
           '<i data-key="' + v.id + '" onclick="checkedThis(this);"></i>' +
           '<img src="' + imgurl + v.goods.mainPhotoPath + '" alt="" onerror="this.src=\'images/none-image.png\'">' +
           '<div class="order_goods_right">' +
           '<h1>' + v.goods.goods_name + '</h1>' +
           '<h2>' + v.spec_info + '</h2>' +
           '<h3><em>￥' + formatPrice(v.price) + '</em>x' + v.count + '</h3>' +
           '</div>' +
           '</div>';
    });
    return html;
}

function redirectUrlForm(url, type) {
    var goodsIds = getGoodsIds(checkIds);
    if (goodsIds == "") {
        show_alert("请选择商品");
        return false;
    }
    redirect(url + "?type=" + type + "&order_id=" + param.id + "&cart_id=" + goodsIds);
}

function getGoodsIds(arr) {
    var str = '';
    $.each(arr, function (key, v) {
        if (v == 1) {
            str += ',' + key;
        }
    });
    return str ? str.substr(1) : "";
}