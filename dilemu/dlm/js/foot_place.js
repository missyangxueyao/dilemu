/**
 * Created by ZhuXueSong on 2017/6/26.
 */
var pageNumber = 1;
var totalPage = 1;
var bodyHeight = document.body.clientHeight;
var listHeight = 0;
var isLoding = false;
requestOrder(pageNumber);

function requestOrder(page) {
    if (!checkLogin(false)) {
        return false;
    }
    requestData("footmark.htm", {currentPage: page}, function (data) {
        if (!data.success) {
            show_alert(data.msg);
            $(".head-right").remove();
            $("#none_order").show();
            return false;
        }
        totalPage = data.data.totalPage;
        if (data.data.recordList.length > 0) {
            getRequestHtml(data.data.recordList);
        } else {
            $("#none_order").show();
        }
        isLoding = false;
    });
}

function getRequestHtml(list) {
    var html = '';
    $.each(list, function (i, v) {
        html += '<div class="foot-place-goods" onclick="redirect(\'goodsdetail.html?id=' + v.goods.id + '\')"><img src="' + imgurl + v.goods.mainPhotoPath + '" onerror="this.src=\'images/none-image.png\'" alt=""/>' + (v.deleteStatus ? '<span>已下架</span>' : '') + '<h1>' + v.goods.goods_name + '</h1><h2>￥' + formatPrice(v.goods.goods_current_price) + '</h2></div>';
    });
    html += '<div class="clear"></div>';
    if (pageNumber == 1) {
        $("#foot_place").html(html);
    } else {
        $("#foot_place").append(html);
    }
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
        requestOrder(pageNumber);
    }
});

/**
 * 清空足迹
 */
function resetFootPlace() {
    if (!confirm("确定清空足迹？")) {
        return false;
    }
    requestData("delFootmark.htm", {}, function (data) {
        if (data.success) {
            show_alert(data.msg);
            listHeight = 0;
            pageNumber = 1;
            $("#foot_place").html("");
            $("#none_order").show();
            $(".head-right").remove();
        } else {
            show_alert(data.msg);
        }
    });
}
