/**
 * Created by ZhuXueSong on 2017/6/28.
 */
var param = get_param();
//最多退款金额
var AllMoney = sessionStorage.getItem("orderPrice");
//运费
var ShipPrice = sessionStorage.getItem("orderShipPrice");
$(".order-refund-money > h2").html("最多￥" + AllMoney + " &nbsp; 含发货邮费￥" + ShipPrice);
var orderGoods = sessionStorage.getItem("orderGoods");
if (orderGoods == "" || !param.order_id || !param.cart_id) {
    show_alert_back("订单不存在");
}

/*requestData("upload_init.htm", {}, function (data) {
    config.accessKeyId = data.data.accessKeyId;
    config.accessKeySecret = data.data.accessKeySecret;
}, false);*/

orderGoods = JSON.parse(orderGoods);
var cart_ids = param.cart_id.split(",");
var imagesUrl = "";
getGoodsListHtml(cart_ids, orderGoods);


var selectArea = new MobileSelectArea();
selectArea.init({trigger: '#re', data: 'select-type/data.json', position: "bottom", id: 'selectArea1'});
if (parseInt(param.type) == 1) {
    var selectArea2 = new MobileSelectArea();
    selectArea2.init({trigger:'#status',data:'select-type/order_status.json', position:"bottom", id:'selectArea2'});
}

function addImages(url, name) {
    var obj = $(".upload-btn");
    obj.before('<div class="img-box"><img src="' + url + '" alt="" data-src="' + name + '"/><i onclick="deleteUpload(this);">╳</i></div>');
}

function deleteUpload(obj) {
    var url = $(obj).siblings("img").attr("data-src");
    imagesUrl = imagesUrl.replace("," + url, ",");
    imagesUrl = imagesUrl.replace(url, "");
    $(obj).parent(".img-box").remove();
}

function getGoodsListHtml(cart_id, list) {
    var html = '';
    if (!cart_id) {
        return false;
    }
    $.each(list, function (i, v) {
        $.each(cart_id, function (key, val) {
            if (v.id == val) {
                html += '<div class="order_goods">' +
                    '<img src="' + imgurl + v.goods.mainPhotoPath + '" alt="" onerror="this.src=\'images/none-image.png\'">' +
                    '<div class="order_goods_right">' +
                    '<h1>' + v.goods.goods_name + '</h1>' +
                    '<h2>' + v.spec_info + '</h2>' +
                    '<h3><em>￥' + formatPrice(v.price) + '</em>x' + v.count + '</h3>' +
                    '</div>' +
                    '</div>';
            }
        });
    });
    $(".right_content").html(html);
}
//实例化上传图片接口
/*var client = new OSS.Wrapper({
    region: "oss-cn-shanghai",
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: "dilemu-app"
});*/

document.getElementById('file').addEventListener('change', function (e) {
    var _obj = $(this);
    var id = _obj[0].id;
    $("body").append(loading_html);
    var time = new Date();
    var header = {
        "clientVersion": "1.0",
        "requestTime": time,
        "serviceVersion": "1.0",
        "sourceID": "101",
        "userToken": _token,
        "folder": "shop/service"
    };
    $.ajaxFileUpload({
        url: config.host + "upload.htm",
        dataType: "json",
        secureuri: false,
        fileElementId: id,//<input type="file" name="file" id="file"/>name名一定要加上,和id名相同吧
        data: header,
        success: function (result) {
            $(".loading_dialog").remove();
            console.log(result);
            addImages(imgurl + result.data, result.data);
            if (imagesUrl == "") {
                imagesUrl = result.data;
            } else {
                imagesUrl += "," + result.data;
            }
        },
        error: function (res) {
            console.log("请检查网络");
            $(".loading_dialog").remove();
        }
    });



    /*var file = e.target.files[0];
    //判断图片格式
    var type = getImageType(file.type);
    if (type === false) {
        show_alert("请上传图片文件");
        return false;
    }
    var storeAs = 'shop/service/' + getImageName() + type;
    client.multipartUpload(storeAs, file).then(function (result) {
        addImages(imgurl + storeAs, storeAs);
        if (imagesUrl == "") {
            imagesUrl = storeAs;
        } else {
            imagesUrl += "," + storeAs;
        }
    }).catch(function (err) {
        show_alert("服务器错误");
        console.log(err);
    });*/
});

/**
 * 获取文件后缀名
 * @param type
 * @return {boolean|string}
 */
function getImageType(type) {
    var _type = type.replace("image/", "");
    if (_type == type) {
        return false;
    }
    return "." + _type;
}

/**
 * 生成文件名称
 * @return {*}
 */
function getImageName() {
    var timeStamp = new Date().getTime();
    var rand = Math.random() * 1000;
    return timeStamp + "" + parseInt(rand);
}

function checkMoneyNum(obj) {
    if (parseFloat(obj.value) > parseFloat(AllMoney)) {
        show_alert("退款金额不能大于订单总价");
        obj.value = AllMoney;
        return false;
    }
}


function submitThisForm() {
    var return_goods_status = "";
    if (parseInt(param.type) == 1) {
        return_goods_status = $("#status").val();
        if (return_goods_status == "") {
            show_alert("请选择货物状态");
            return false;
        }
    }
    var return_reason = $("#re").val();
    if (return_reason == "") {
        var txt = '';
        if (param.type == 3) {
            txt = "请选择换货原因";
        } else {
            txt = "请选择退款原因";
        }
        show_alert("txt");
        return false;
    }
    var return_content = $("#return_content").val();
    var return_fee = $("#return_fee").val();
    if (return_fee == "") {
        show_alert("请输入退款金额");
        return false;
    }
    var request = {
        id: parseInt(param.order_id),
        return_flag: parseInt(param.type) - 1,
        return_content: return_content,
        return_goods_status: return_goods_status,
        return_reason: return_reason,
        return_fee: return_fee,
        return_gc_ids: param.cart_id,
        return_pic: imagesUrl
    };
    requestData("customer_service_apply.htm", request, function (data) {
        if (data.success) {
            show_alert("提交成功", "", "", "", true);
            setTimeout(function () {
                history.go(-3);
                location.reload();
            }, config.timeOut);
        } else {
            show_alert(data.msg);
        }
    });
}