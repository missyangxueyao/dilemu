/**
 * Created by ZhuXueSong on 2017/6/17.
 */
var pageNumber = 1;
var totalPage = 1;
var bodyHeight = document.body.clientHeight;
var listHeight = 0;
var orderStatus = "";
var isLoding = false;

var param = get_param();
orderStatus = param.status ? param.status : "";

$(document).ready(function () {
    if (!checkLogin(false)) {
        return false;
    }
    $(".order_head > span[data-type='" + orderStatus + "']").addClass("checked");

    $(".order_head > span").click(function () {
        changeStatus(this);
        orderStatus = $(this).attr("data-type");
        pageNumber = 1;
        history.replaceState("", "", "orders.html?status=" + orderStatus);
        requestOrder(orderStatus, 1);
    });
    requestOrder(orderStatus, 1);
});

/**
 * 切换订单状态
 * @param obj
 * @return {boolean}
 */
function changeStatus(obj) {
    obj = $(obj);
    if (obj.hasClass("checked")) {
        return false;
    }
    obj.addClass("checked").siblings("span").removeClass("checked");
}

/**
 * 获取订单数据
 * @param status
 * @param page
 */
function requestOrder(status, page) {
    page = page ? page : 1;
    var obj = $(".order_list");
    requestData("order.htm", {order_status: status, currentPage: page}, function (data) {
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

function getOrderHtml(list) {
    var html = '';
    if (list.length == 0) {
        return html;
    }
    $.each(list, function (i, v) {
        var goodsCount = 0;
        $.each(v.gcs, function (j, val) {
            goodsCount += val.count;
        });
        html += '<div class="order_body">' +
            '<div class="order_title" onclick="redirect(\'orders_info.html?id=' + v.id + '\')">订单号：' + v.order_id + ' <em>' + getOrderStatus(v.order_status) + '</em></div>' +
            '<div class="orderGoodsContent">' + getOrderInfoGoods(v.gcs, "orders_info.html?id=" + v.id) + '</div>' +
            '<div class="order_foot">' +
            '<h1>共' + goodsCount + '件商品 &nbsp; 合计：￥' + formatPrice(v.totalPrice) + '（含运费￥' + formatPrice(v.ship_price) + '）</h1>' +
            getOrdersBtn(v.order_status, v.delay_flag, v.id) +
            '</div>' +
            '</div>';
    });
    return html;
}

