/**
 * Created by ZhuXueSong on 2017/6/26.
 */
var pageNumber = 1;
var totalPage = 1;
var bodyHeight = document.body.clientHeight;
var listHeight = 0;
var orderStatus = 0;
var isLoding = false;

var param = get_param();
orderStatus = param.status ? param.status : 0;

$(document).ready(function () {
    $(".order_head > span[data-status='" + orderStatus + "']").addClass("checked");

    $(".order_head > span").click(function () {
        changeStatus(this);
    });
    requestOrder(orderStatus, 1);
});

function changeStatus(obj) {
    obj = $(obj);
    if (obj.hasClass("checked")) {
        return false;
    }
    obj.addClass("checked").siblings("span").removeClass("checked");
    orderStatus = parseInt(obj.attr('data-status'));
    pageNumber = 1;
    history.replaceState("", "", "group_buy.html?status=" + orderStatus);
    requestOrder(orderStatus, 1);
}

/**
 * 获取订单数据
 * @param status
 * @param page
 */
function requestOrder(status, page) {
    if (!checkLogin(false)) {
        return false;
    }
    page = page ? page : 1;
    var obj = $(".order_list");
    requestData("listHsGroup.htm", {type: status, currentPage: page}, function (data) {
        if (!data.success) {
            obj.html("");
            $("#none_order").show();
            return false;
        } else {
            $("#none_order").hide();
        }
        totalPage = data.data.totalPage;
        var html = getOrderHtml(data.data.recordList);
        if (page == 1) {
            obj.html("");
            obj.html(html);
        } else {
            obj.append(html);
        }
        listHeight = document.getElementById("load_more").offsetTop;
        isLoding = false;
    });
}


function getOrderHtml(list) {
    var html = '';
    if (list.length == 0) {
        return html;
    }
    $.each(list, function (i, v) {
        html += '<div class="order_body">' +
            '<div class="order_title" onclick="redirect(\'group_buy_info.html?id=' + v.order_id + '\')">订单号：' + v.order_id + ' <em>' + getOrderStatus(v.order_status) + '</em></div>' +
            '<div class="orderGoodsContent">' + getOrderInfoGoods(v) + '</div>' +
            '<div class="order_foot">' +
            '<h1>共' + v.goodsCount + '件商品 &nbsp; 合计：￥' + formatPrice(v.totalPrice) + '（含运费￥' + formatPrice(v.ship_price) + '）</h1>' +
            getOrdersBtn(v.order_status, v.order_id) +
            '</div>' +
            '</div>';
    });
    return html;
}

function getOrdersBtn(order_status, id) {
    var btn = '';
    switch (order_status) {
        case 20:
            btn = '<span class="order_btn" onclick="redirect(\'group_buy_info.html?id=' + id + '\')">查看详情</span>';
            break;
        case 21:
            btn = '<span class="order_red_btn" onclick="show_alert(\'请点击右上角按钮选择分享给好友\');">邀请好友</span><span class="order_btn" onclick="redirect(\'group_buy_info.html?id=' + id + '\')">查看详情</span>';
            break;
        case 22:
            btn = '<span class="order_btn" onclick="redirect(\'group_buy_info.html?id=' + id + '\')">查看详情</span><span class="order_btn" onclick="deleteOrder(' + id + ')">删除订单</span>';
            break;
        default:
            btn = '';
            break;
    }
    return btn;
}

function getOrderStatus(order_status) {
    console.log(order_status);
    var text = '';
    switch (order_status) {
        case 21:
            text = "待成团";
            break;
        case 20:
            text = "已成团";
            break;
        case 22:
            text = "拼团失败";
            break;
        default:
            text = "已成团";
            break;
    }
    return text;
}


/**
 * 订单详情中商品信息
 * @param v
 * @return {string}
 */
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
        '<h3><em>￥' + formatPrice(v.price) + '</em>x' + v.goodsCount + '</h3>' +
        '</div>' +
        '</div>';
    return html;
}

$(window).scroll(function () {
    if (totalPage <= pageNumber) {
        return false;
    }
    if (isLoding) {
        return false;
    }
    var wScrollY = window.scrollY;
    if (wScrollY >= listHeight - bodyHeight - 20) {
        pageNumber++;
        isLoding = true;
        requestOrder(orderStatus, pageNumber);
    }
});

/**
 * 删除订单
 * @param id
 */
function deleteOrder(id) {
    if (!confirm("确定删除订单？")) {
        return false;
    }
    show_alert("删除成功", "", "", "", "success");
}