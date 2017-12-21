/**
 * Created by ZhuXueSong on 2017/6/20.
 */
var param = get_param();//接收参数

var allPrice = 0;               //订单总价格
var couponId = "";              //优惠券id
var shippingKey = "";           //配送方式key
var integralPrice = "";         //积分抵扣金额
var couponAmount = 0;           //优惠券抵扣金额
var shippingValue = 0;          //总运费
var isUserIntegral = 0;         //是否使用积分
var addressId = 0;              //收货地址id
var allAddressJson = "";        //保存收货地址信息
var payType = "";               //支付方式
var goodsIds = "";              //商品id集合
if (!checkLogin(false)) {
    console.log("请登录");
} else if (param.carId) {
    requestData("goods_cart2.htm", {gc_ids: param.carId}, function (data) {
        if (data.success) {
            data = data.data;
            setAddressHtml(data.addrs);  //收货地址
            $(".order-info-content").html(getOrderInfoGoods(data.goodsCart).replace(new RegExp('dilemu/goodsdetail', 'gm'), "goodsdetail"));            //订单商品
            getGoodsIs(data.goodsCart);     //商品id集合
            couponInfo(data.couponinfos);    //优惠券
            integralInfo(data.integral, data.deduction);    //积分抵扣
            //计算订单商品总价
            getOrderAllPrice(data.goodsCart);
            //配送方式
            setShipping(data.transportWay);
        } else {
            show_alert_back(data.msg);
        }
    });
}

$(document).ready(function () {
    payType = "";
    $(".checkbox_label input").attr("checked", false);
    $(".checkbox_label > i").click(function () {
        var obj = $(this);
        if (obj.siblings("input").attr("checked")) {
            obj.removeClass("checked");
            isUserIntegral = 0;
            allPrice = allPrice + integralPrice;
        } else {
            obj.addClass("checked");
            isUserIntegral = 1;
            allPrice = allPrice - integralPrice;
        }
        setOrderPrice(allPrice, shippingValue);
    });
    $(".radio_label i").click(function () {
        $(this).addClass('checked').removeClass('check');
        payType = "weChat";
    });
});

/**
 * 拼接商品id集合
 * @param list
 */
function getGoodsIs(list) {
    $.each(list, function (i, v) {
        goodsIds += "," + v.goods.id;
    });
    goodsIds = goodsIds.substr(1);
}

/**
 * 收货地址
 * @param address
 * @return {boolean}
 */
function setAddressHtml(address) {
    if (address.length == 0) {
        return false;
    }
    address = address[0];
    addressId = address.id;
    $(".address a p:first-child").html(address.trueName + " &nbsp; " + address.mobile);
    $(".address a p:last-child").html(getAddress(address));
    $(".newadd").hide();
    $(".address").show();
}

/**
 * 优惠券
 * @param coupon
 * @return {boolean}
 */
function couponInfo(coupon) {
    if (coupon.length == 0) {
        $("#coupon").html("暂无可用优惠券").css("background", "none");
        return false;
    }
    var html = '';
    $.each(coupon, function (i, v) {
        html += '<div class="coupon-body" onclick="selectThisCoupon(' + v.id + ', \'' + v.coupon.coupon_name + '\', ' + v.coupon.coupon_amount + ')">' +
            '<em>￥</em>' +
            '<span>' + v.coupon.coupon_amount + '</span>' +
            '<h1>满' + v.coupon.coupon_order_amount + '元可用</h1>' +
            '<h2>有效期：' + get_date(v.coupon.coupon_begin_time) + ' 至 ' + get_date(v.coupon.coupon_end_time) + '</h2>' +
            '</div>';
    });
    $("#coupon").click(function () {
        $("#couponInfo").show();
    });
    $("#couponInfo").append(html + '<div style="height: 0.4rem;"></div>');
}

/**
 * 积分
 */
function integralInfo(integral, money) {
    $("#integral").html("可用" + integral + "积分抵扣￥" + formatPrice(money));
    //积分抵扣金额
    integralPrice = money;
}

/**
 * 订单总价格
 * @param goods
 */
function getOrderAllPrice(goods) {
    $.each(goods, function (i, v) {
        allPrice += parseFloat(v.price) * v.count;
    });
    setOrderPrice(allPrice, 0);
}

/**
 * 显示价格
 * @param price
 * @param fee
 */
function setOrderPrice(price, fee) {
    if (allPrice <= 0) {
        $("#price").html("￥" + formatPrice("0.01"));
    } else {
        $("#price").html("￥" + formatPrice(allPrice));
    }
    $("#fee").html(formatPrice(fee));
}

/**
 * 选择优惠券
 * @param id
 * @param name
 * @param price
 */
function selectThisCoupon(id, name, price) {
    $("#coupon").html(name);
    couponId = id;
    $("#couponInfo").hide();
    allPrice = allPrice + couponAmount - price;
    couponAmount = price;
    setOrderPrice(allPrice, shippingValue);
}

/**
 * 获取配送方式
 * @param list
 * @return {boolean}
 */
function setShipping(list) {
    var listLength = list.length
    $("#shipping_text").attr("data-num", listLength);
    if (listLength == 0) {
        return false;
    }
    var html = '';
    $.each(list, function (i, v) {
        html += '<div class="shipping_type" onclick="selectThisShipping(\'' + v.key + '\', ' + v.value + ');">' + v.key + '</div>';
    });
    $("#shipping").append(html);
}

function showThisShipping(obj) {
    var num = $(obj).attr('data-num');
    if (parseInt(num) <= 0) {
        show_alert("请先选择收货地址");
        return false;
    }
    $("#shipping").show();
}

/**
 * 选择配送方式
 * @param key
 * @param value
 */
function selectThisShipping(key, value) {
    $("#shipping_text").html(key);
    $("#shipping").hide();
    //计算总价格
    allPrice = allPrice - shippingValue + value;
    setOrderPrice(allPrice, value);
    shippingKey = key;
    shippingValue = value;
}

/**
 * 显示所有收货地址
 */
function showAllAddress() {
    loadAddress(true);
    $("#addressList").show();
}

/**
 * 加载所有收货地址
 * @param type
 */
function loadAddress(type) {
    requestData("address.htm", {pageSize: 10000}, function (data) {
        if (!data.success) {
            return false;
        }
        var html = '';
        allAddressJson = data.data.recordList;
        $.each(allAddressJson, function (i, v) {
            html += '<div class="orders-info-address address-list">' +
                '<i onclick="showAddressInfo(' + i + ');"></i> <div onclick="selectThisAddress(this, ' + v.id + ', ' + v.area.id + ');"> <h1>' + v.trueName + ' &nbsp; ' + v.mobile + '</h1>' +
                '<h2>' + getAddress(v) + '</h2> </div> </div>';
        });
        $("#addressList .address-list").remove();
        $("#addressList").append(html);
    }, type);
}

/**
 * 选择当前地址
 * @param obj
 * @param id
 * @param areaId
 */
function selectThisAddress(obj, id, areaId) {
    obj = $(obj);
    addressId = id;
    loadingShipping(areaId);
    var html = "<p>" + obj.find('h1').html() + "</p><p>" + obj.find('h2').html() + "</p>";
    $(".address").show().find("a").html(html);
    $(".newadd").hide();
    $("#addressList").hide();
}

//选择地区
var selectArea = new MobileSelectArea();
selectArea.init({trigger: '#area', data: 'select-type/area.json', position: "bottom", id: 'selectArea'});

var isDefault = 0;

/**
 * 默认收货地址按钮切换
 * @param obj
 */
function checkedDefault(obj) {
    obj = $(obj).children("i");
    if (obj.hasClass("checked")) {
        obj.removeClass("checked");
        isDefault = 0;
    } else {
        obj.addClass("checked");
        isDefault = 1;
    }
}

/**
 * 显示地址详情
 * @param key
 */
function showAddressInfo(key) {
    var titleObj = $("#addressInfo .head-center");
    if (key !== '') {
        //设置地址信息
        titleObj.html("编辑收货地址");
        var addInfo = allAddressJson[key];
        $('#trueName').val(addInfo.trueName);
        $("#mobile").val(addInfo.mobile);
        $("#area").val(addInfo.area.parent.parent.areaName + " " + addInfo.area.parent.areaName + " " + addInfo.area.areaName).attr("data-value", addInfo.area.parent.parent.id + "," + addInfo.area.parent.id + "," + addInfo.area.id);
        $("#areaInfo").val(addInfo.area_info);
        if (addInfo.def) {
            $(".icon-default-address").addClass("checked");
            isDefault = 1;
        } else {
            $(".icon-default-address").removeClass("checked");
            isDefault = 0;
        }
        $("#addressInfo .head-right").attr("data-id", addInfo.id).show();
        $("#delivery-after-btn").attr("data-id", addInfo.id);
    } else {
        titleObj.html("新增收货地址");
        document.getElementById("addressInfoForm").reset();
        isDefault = 0;
        $(".icon-default-address").removeClass("checked");
        $("#area").attr("data-value", "");
        $("#delivery-after-btn").attr("data-id", "");
        $("#addressInfo .head-right").hide();
    }
    $("#addressInfo").show();
}

/**
 * 保存地址信息
 * @param obj
 * @return {boolean}
 */
function saveAddressInfo(obj) {
    var addId = parseInt($(obj).attr("data-id"));
    var trueName = $("#trueName").val();
    if (trueName == "") {
        show_alert("请输入真实姓名");
        return false;
    }
    var mobile = $("#mobile").val();
    if (mobile.length != 11) {
        show_alert("请输入正确的手机号码");
        return false;
    }
    var area = $("#area").attr("data-value");
    if (area == "") {
        show_alert("请选择收货地区");
        return false;
    }
    area = parseFloat(getLastAreaId(area));
    var areaInfo = $("#areaInfo").val();
    if (areaInfo == "") {
        show_alert("请输入街道门牌号");
        return false;
    }
    var postData = {trueName: trueName, mobile: mobile, area_id: area, area_info: areaInfo, def: isDefault};
    if (addId > 0) {
        postData.id = addId;
    }
    requestData("address_save.htm", postData, function (data) {
        if (!data.success) {
            show_alert(data.msg);
            return false;
        }
        show_alert("操作成功");
        loadAddress(false);
        $("#addressInfo").hide();
    });
}

/**
 * 获取最后一个地区id
 * @param area
 * @return {string}
 */
function getLastAreaId(area) {
    if (area.replace(",", "") == area) {
        return area;
    }
    area = area.split(",");
    return area[2] ? area[2] : (area[1] ? area[1] : area[0]);
}

/**
 * 删除收货地址
 * @param obj
 * @return {boolean}
 */
function deleteAddressInfo(obj) {
    var id = parseInt($(obj).attr("data-id"));
    if (!id) {
        return false;
    }
    requestData("address_del.htm", {mulitId: id}, function (data) {
        if (data.success) {
            show_alert("删除成功");
            loadAddress(false);
            $("#addressInfo").hide();
        } else {
            show_alert(data.msg);
        }
    })
}

/**
 * 异步加载配送方式
 * @param area_id
 */
function loadingShipping(area_id) {
    requestData("load_transport.htm", {gc_ids: param.carId, area_id: area_id}, function (data) {
        if (data.success) {
            setShipping(data.data);
        } else {
            show_alert(data.msg);
        }
    });
}


/**
 * 确认支付
 * gc_ids           购物车ID（多个以 "," 隔开）
 * addr_id          收货地址id
 * coupon_id        优惠券id
 * type             下单方式
 * invoiceType      发票信息
 * ship_price       配送费用
 * transport        配送方式
 * msg              买家留言
 * isUserIntegral   是否使用积分
 */
function payNow() {
    if (!addressId) {
        show_alert("请选择收货地址");
        return false;
    }
    if (shippingKey == "") {
        show_alert("请选择配送方式");
        return false;
    }
    if (payType == "") {
        show_alert("请选择支付方式");
        return false;
    }
    var postData = {
        gc_ids: param.carId,
        addr_id: addressId,
        coupon_id: couponId,
        type: 2,
        invoiceType: 0,
        ship_price: shippingValue,
        transport: shippingKey,
        msg: "",
        isUserIntegral: isUserIntegral
    };
    requestData("goods_cart3.htm", postData, function (data) {
        if (data.success) {
            data = data.data;
            redirect(config.host + "js_pay_init.htm?orderId=" + data.id + "&flag=0", true);
        } else {
            show_alert(data.msg);
        }
    })
}

