/**
 * Created by ZhuXueSong on 2017/6/30.
 */

var pageNumber = 1;
var totalPage = 1;
var bodyHeight = document.body.clientHeight;
var listHeight = 0;
var isLoding = false;
request();

/**
 * 加载数据
 */
function request() {
    if (!checkLogin(false)) {
        return false;
    }
    requestData("coupon.htm", {currentPage: pageNumber}, function (data) {
        if (!data.success) {
            $("#none_order").show();
            return false;
        }
        totalPage = data.data.totalPage;
        couponInfo(data.data.recordList);
        isLoding = false;
    });
}

/**
 * 优惠券
 * @param coupon
 * @return {boolean}
 */
function couponInfo(coupon) {

    var html = '';
    $.each(coupon, function (i, v) {
        html += '<div class="coupon-body">' +
            '<em>￥</em>' +
            '<span>' + v.coupon.coupon_amount + '</span>' +
            '<h1>满' + v.coupon.coupon_order_amount + '元可用</h1>' +
            '<h2>有效期：' + get_date(v.coupon.coupon_begin_time) + ' 至 ' + get_date(v.coupon.coupon_end_time) + '</h2>' +
            '</div>';
    });
    $("#couponInfo").append(html);
    listHeight = document.getElementById("load_more").offsetTop;
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
        request();
    }
});