/**
 * Created by ZhuXueSong on 2017/6/30.
 */
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
    requestData("exchange.htm", {currentPage: pageNumber}, function (data) {
        if (!data.success) {
            $("#none_order").show();
            return false;
        }
        data = data.data.data;
        if (pageNumber == 1) {
            $("#number").text(data.integral);
        }
        totalPage = data.totalPage;
        couponInfo(data.recordList);
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
        html += '<tr><td>' + v.type + '</td><td>' + v.integral + '</td><td>' + get_date(v.addTime) + '</td></tr>';
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