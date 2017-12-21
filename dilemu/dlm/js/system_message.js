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
    requestData("message.htm", {currentPage: page, pageSize: 16}, function (data) {
        if (!data.success) {
            show_alert(data.msg);
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
        html += '<div class="system_message_title">'+
        '<h1>' + v.content + '</h1>'+
        '<h2>系统消息<em>' + get_date(v.addTime) + '</em></h2>'+
        '</div>';
    });
    html += '<div class="clear"></div>';
    if (pageNumber == 1) {
        $("#message-content").html(html);
    } else {
        $("#message-content").append(html);
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
