/**
 * Created by ZhuXueSong on 2017/6/28.
 */

var param = get_param();
var order_id = parseInt(param.id);
getThisData();
function getThisData() {
    if (!checkLogin(false)) {
        return false;
    }
    //加载订单信息
    requestData('saleService_view.htm', {id: order_id}, function (data) {
        if (!data.success) {
            show_alert_back(data.msg);
        }
        setOrderInfoData__(data.data);
    });
}

function setOrderInfoData__(info) {
    $(".orders-info-address > h1").html(info.addr.trueName + " &nbsp; " + info.addr.mobile);
    $(".orders-info-address > h2").html(getAddress(info.addr));
    $(".order-info-fee").before(getOrderInfoGoods(info.gcs));
    $("#ci").html("优惠券：" + (info.ci ? info.ci.coupon.coupon_name : "未使用"));
    $("#integral").html(info.integral ? "积分抵扣：" + info.integral + "积分抵扣￥" + formatPrice(info.deduction) : "积分抵扣：未使用");
    $("#ship").html("运费：￥" + formatPrice(info.ship_price));
    $("#total").html("实付款(含运费)：￥" + formatPrice(info.totalPrice));
    $("#goodsStatus").html(info.return_goods_status);
    $("#returnRe").html(info.return_reason);
    $("#returnMoney").html("￥" + formatPrice(info.return_fee));
    $("#returnAss").html(info.return_reason);
    if (info.order_status == 30 || info.order_status == 40) {
        $(".customer-service").attr("data-url", "customer_service.html?id=" + info.id + "&status=" + info.order_status).show();
    }
    var logHtml = '<h1>订单编号：' + info.order_id + '</h1>';
    logHtml += '<h2>创建时间：' + get_date(info.addTime, true) + '</h2>';
    if (info.payTime) {
        logHtml += '<h2>付款时间：' + get_date(info.payTime, true) + '</h2>';
    }
    if (info.shipTime) {
        logHtml += '<h2>发货时间：' + get_date(info.shipTime, true) + '</h2>';
    }
    if (info.confirmTime) {
        logHtml += '<h2>收货时间：' + get_date(info.confirmTime, true) + '</h2>'
    }
    if (info.return_applyTime) {
        logHtml += '<h2>申请时间：' + get_date(info.return_applyTime, true) + '</h2>';
    }
    $(".order-info-log").html(logHtml);
    //$("#order_info_foot").html(getOrdersBtn(info.order_status, info.delay_flag, info.id));

    var footHtml = '';
    if (param.type != 0) {
        if (info.order_status == 42) {
            footHtml = '<span style="float: none; width: 2rem; display: inline-block;" class="order_red_btn" id="bottom" onclick="redirect(\'set_send_info.html?id=' + param.id + '\')">填写物流信息</span>';
        } else if (info.order_status == 45) {
            footHtml = '<span style="float: none; width: 2rem; display: inline-block;" class="order_red_btn" id="bottom" onclick="redirect(\'check_send_no.html?id=' + param.id + '\')">查看物流信息</span>';
            if (param.type == 2) {
                footHtml += '<span style="float: none; width: 2rem; display: inline-block;" class="order_red_btn" id="bottom" onclick="confirmFinished(' + param.id + ')">确认收货</span>';
            }
        } else {
            footHtml = info.status_txt;
        }
    } else {
        footHtml = info.status_txt;
    }
    $("#order_info_foot").html(footHtml);

    var html = getReturnPic(info.return_pic);
    if (html == false) {
        $(".order-refund-update").hide();
    } else {
        $(".order-refund-update .clear").before(html);
    }
}

function getReturnPic(pics) {
    if (pics == "") {
        return false;
    }
    pics = pics.split(",");
    var html = '';
    $.each(pics, function (i, v) {
        html += '<div class="img-box"><img src="' + imgurl + v + '" alt="" onerror="this.src=\'images/none-image.png\'"/></div>';
    });
    return html;
}

function confirmFinished(id) {
    requestData("saleService_return_cofirm.htm", {id: id}, function (data) {
        if (!data.success) {
            show_alert(data.msg);
        } else {
            show_alert("收货成功", true);
        }
    });
}