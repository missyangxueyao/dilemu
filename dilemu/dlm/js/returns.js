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

$(document).ready(function () {
    if (!checkLogin(false)) {
        return false;
    }
    $(".order_head > span").click(function () {
        changeStatus(this);
    });
    if (param.status && param.status != '0') {
        orderStatus = param.status;
        $("span[data-flag='" + orderStatus + "']").click();
    } else {
        requestOrders();
    }
});

/**
 * 导航切换
 * @param obj
 * @return {boolean}
 */
function changeStatus(obj) {
    obj = $(obj);
    if (obj.hasClass("checked")) {
        return false;
    }
    obj.addClass("checked").siblings("span").removeClass("checked");
    orderStatus = parseInt(obj.attr("data-flag"));
    pageNumber = 1;
    history.replaceState("", "", "returns.html?status=" + orderStatus);
    requestOrders();
}

function requestOrders() {
    requestData("saleService.htm", {return_flag: orderStatus, currentPage: pageNumber}, function (data) {
        if (!data.success) {
            $(".order_list").html("");
            $("#none_order").show();
            return false;
        }
        totalPage = data.data.totalPage;
        $("#none_order").hide();
        getHtml(data.data.recordList);
    });
}

function getHtml(list) {
    var html = '';
    $.each(list, function (key, val) {
        html += '<div class="order_body" onclick="redirect(\'return_info.html?id=' + val.id + '&type=' + orderStatus + '\')">' +
        '<div class="order_title">订单号：' + val.order_id + ' <em>' + val.status_txt + '</em></div>' +
            getOrderInfoGoods(val.gcs, "return_info.html?id=" + val.id + "&type=" + orderStatus) +
        '<div class="order_foot" style="height: 0.4rem;">' +
        '<h1>共' + val.gcs.length + '件商品 &nbsp; 合计：￥' + formatPrice(val.totalPrice) + '（含运费￥' + formatPrice(val.ship_price) + '）</h1>' +
        '</div>' +
        '</div>';
    });
    var obj = $(".order_list");
    if (pageNumber == 1) {
        obj.html(html);
    } else {
        obj.append(html);
    }
    listHeight = document.getElementById('load_more').offsetTop;
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
        requestOrders();
    }
});

