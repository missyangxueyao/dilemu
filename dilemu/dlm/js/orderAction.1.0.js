/**
 * Created by ZhuXueSong on 2017/6/19.
 */

function setOrderInfoData(info) {
    $(".orders-info-status > h1").html(getOrderStatus_(info.order_status));
    $(".orders-info-status > h2").html("下单时间：" + get_date(info.addTime, true));
    $(".orders-info-status > i").addClass(getStatusIconClass(info.order_status));
    $(".orders-info-address > h1").html(info.addr.trueName + " &nbsp; " + info.addr.mobile);
    $(".orders-info-address > h2").html(getAddress(info.addr));
    sessionStorage.setItem("orderGoods", JSON.stringify(info.gcs));//保存订单商品
    sessionStorage.setItem("orderPrice", formatPrice(info.totalPrice));
    sessionStorage.setItem("orderShipPrice", formatPrice(info.ship_price));
    $(".order-info-fee").before(getOrderInfoGoods(info.gcs));
    $("#ci").html("优惠券：" + (info.ci ? info.ci.coupon.coupon_name : "未使用"));
    $("#integral").html(info.integral ? "积分抵扣：" + info.integral + "积分抵扣￥" + formatPrice(info.deduction) : "积分抵扣：未使用");
    $("#ship").html("运费：￥" + formatPrice(info.ship_price));
    $("#total").html("实付款(含运费)：￥" + formatPrice(info.totalPrice));
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
    $(".order-info-log").html(logHtml);
    $("#order_info_foot").html(getOrdersBtn(info.order_status, info.delay_flag, info.id));
}

/**
 * 获取订单按钮
 * @param order_status  订单状态码
 * @param delay_flag    是否允许延长收货
 * @param id            订单id
 * @return {string}
 */
function getOrdersBtn(order_status, delay_flag, id) {
    var btn = '';
    switch (order_status) {
        case 0:
            btn = '<span class="order_btn" onclick="deleteOrder(' + id + ');">删除订单</span>';
            break;
        case 10:
            btn = '<span class="order_red_btn" onclick="redirect(config.host+\'js_pay_init.htm?orderId=' + id + '&flag=0\')">去支付</span><span class="order_btn" onclick="cancelOrder(' + id + ')">取消订单</span>';
            break;
        case 20:
            btn = '<span class="order_red_btn" onclick="alertSendOrder(' + id + ');">提醒发货</span><span class="order_btn" onclick="cancelOrder(' + id + ')">取消订单</span>';
            break;
        case 25:
            btn = '<span class="order_btn" onclick="deleteOrder(' + id + ');">删除订单</span>';
            break;
        case 30:
            btn = '<span class="order_red_btn" onclick="confirmOrder(' + id + ');">确认收货</span><span class="order_btn"  onclick="redirect(\'check_send_no.html?id=' + id + '\')">查看物流</span>';
            if (delay_flag == 0) {
                btn += '<span class="order_btn" onclick="redirect(\'delivery_after.html?id=' + id + '\')">延长收货</span>';
            }
            break;
        case 40:
            btn = '<span class="order_red_btn" onclick="redirect(\'order_commit.html?id=' + id + '\')">去评价</span>';
            break;
        default:
            btn = '';
            break;
    }
    return btn;
}


/**
 * 获取订单状态
 * @param order_status
 * @return {*}
 */
function getOrderStatus(order_status) {
    var status = {
        0: "已取消",
        10: "待付款",
        15: "线下支付待审核",  //已取消
        16: "货到付款待发货",  //已取消
        20: "已付款",
        21: "已成团",
        22: "未成团",
        23: "取消审核中",
        24: "取消失败",
        25: "取消成功",
        30: "已发货",
        40: "已收货",
        45: "买家申请退货",
        46: "退货中",
        47: "退货完成，已结束",
        48: "卖家拒绝退货",
        49: "退货失败",
        50: "已完成,已评价",
        60: "已结束",
        65: "已结束，不可评价"
    };
    return status[order_status];
}

/**
 * 订单详情获取订单状态
 * @param order_status
 * @return {*}
 * @private
 */
function getOrderStatus_(order_status) {
    var status = {
        0: "买家已取消",
        10: "等待买家付款",
        15: "线下支付待审核",  //已取消
        16: "货到付款待发货",  //已取消
        20: "买家已付款",
        21: "订单拼团成功",
        22: "订单拼团失败",
        23: "取消操作审核中",
        24: "取消操作失败",
        25: "取消审核成功",
        30: "卖家已发货",
        40: "买家已收货",
        45: "买家申请退货",
        46: "订单退货中",
        47: "订单退货完成，已结束",
        48: "卖家拒绝退货",
        49: "订单退货失败",
        50: "订单已完成,已评价",
        60: "订单已结束",
        65: "已结束，不可评价"
    };
    return status[order_status];
}

/**
 * 获取订单状态的类名称
 * @param status
 * @return {string}
 */
function getStatusIconClass(status) {
    var _class = "";
    switch (status) {
        case 10:
            _class = "dfk";
            break;
        case 20:
            _class = "dfh";
            break;
        case 30:
            _class = "dsh";
            break;
        case 40:
            _class = "ywc";
            break;
        case 50:
            _class = "ywc";
            break;
        case 60:
            _class = "ywc";
            break;
        case 65:
            _class = "ywc";
            break;
        default:
            _class = "";
            break;
    }
    return _class;
}

/**
 * 拼接地址详情
 * @param address
 * @return {string}
 */
function getAddress(address) {
    if (!address) {
        return "";
    }
    var text = "";
    if (address.area) {
        if (address.area.parent) {
            if (address.area.parent.parent) {
                text += address.area.parent.parent.areaName + " ";
            }
            text += address.area.parent.areaName + " ";
        }
        text += address.area.areaName + " ";
    }
    text += address.area_info;
    return text;
}

/**
 * 订单详情中商品信息
 * @param list
 * @param url
 * @return {string}
 */
function getOrderInfoGoods(list, url) {
    var html = '';
    if (!list) {
        return html;
    }
    $.each(list, function (i, v) {
        if (!url) {
            var _url = 'goodsdetail.html?id=' + v.goods.id
        } else {
            var _url = url;
        }
        html += '<div class="order_goods" onclick="redirect(\'' + _url + '\')">' +
            '<img src="' + config.imageUrl + v.goods.mainPhotoPath + '" alt="" onerror="this.src=\'images/none-image.png\'">' +
            '<div class="order_goods_right">' +
            '<h1>' + v.goods.goods_name + '</h1>' +
            '<h2>' + v.spec_info + '</h2>' +
            '<h3><em>￥' + formatPrice(v.price) + '</em>x' + v.count + '</h3>' +
            '</div>' +
            '</div>';
        if (v.cart_type == "combin") {
            $.each(v.goods.apiCombin.apiCombinGoods, function (j, val) {
                if (!url) {
                    var _url = 'goodsdetail.html?id=' + val.goods_id
                } else {
                    var _url = url;
                }
                html += '<div class="order_goods" style="margin-top: -0.1rem; background: #FFF; border-top: none;" onclick="redirect(\'' + _url + '\')">' +
                    '<img src="' + config.imageUrl + val.mainPhotoPath + '" alt="" onerror="this.src=\'images/none-image.png\'">' +
                    '<div class="order_goods_right">' +
                    '<h1>' + val.goods_name + '</h1>' +
                    '<h2>&nbsp;</h2>' +
                    '<h3><em>￥' + formatPrice(val.goods_price) +
                    '</div>' +
                    '</div>';
            })
        }
    });
    return html;
}

/**
 * 取消订单操作
 * @param id
 * @return {boolean}
 */
function cancelOrder(id) {
    if (!confirm("确定取消订单？")) {
        return false;
    }
    requestData('order_cancel.htm', {id: id}, function (data) {
        if (data.success) {
            show_alert(data.msg, true);
        } else {
            show_alert(data.msg);
        }
    });
}

/**
 * 删除订单
 * @param id
 * @return {boolean}
 */
function deleteOrder(id) {
    if (!confirm("确定删除此订单？")) {
        return false;
    }
    requestData('order_delete.htm', {id: id}, function (data) {
        if (data.success) {
            if (param.id) {
                show_alert_back(data.msg);
            }  else {
                show_alert(data.msg, true);
            }
        } else {
            show_alert(data.msg);
        }
    });
}

/**
 * 确认收货
 * @param id
 * @return {boolean}
 */
function confirmOrder(id) {
    if (!confirm("确定已收到商品？")) {
        return false;
    }
    requestData('order_cofirm.htm', {id: id}, function (data) {
        if (data.success) {
            show_alert(data.msg, true);
        } else {
            show_alert(data.msg);
        }
    });
}

/**
 * 提醒发货
 * @param id
 */
function alertSendOrder(id) {
    requestData('order_alter.htm', {id: id}, function (data) {
        show_alert(data.msg);
    })
}

