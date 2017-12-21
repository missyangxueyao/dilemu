/**
 * Created by ZhuXueSong on 2017/6/30.
 */
var param = get_param();
$("#order_id").val(param.id);

/*requestData("upload_init.htm", {}, function (data) {
    config.accessKeyId = data.data.accessKeyId;
    config.accessKeySecret = data.data.accessKeySecret;
}, false);*/

//实例化上传图片接口
/*var client = new OSS.Wrapper({
    region: "oss-cn-shanghai",
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: "dilemu-app"
});*/

requestThisData();

function bindSelectImage(id) {
    document.getElementById(id).addEventListener('change', function (e) {
        var _obj = $(this);
        var obj = _obj.parent();
        var id = _obj[0].id;
        $("body").append(loading_html);
        var time = new Date();
        var header = {
            "clientVersion": "1.0",
            "requestTime": time,
            "serviceVersion": "1.0",
            "sourceID": "101",
            "userToken": _token,
            "folder": "shop/evaluate"
        };
        $.ajaxFileUpload({
            url: config.host + "upload.htm",
            dataType: "json",
            secureuri: false,
            fileElementId: id,
            data: header,
            success: function (result) {
                $(".loading_dialog").remove();
                console.log(result);
                addImages(imgurl + result.data, result.data, obj);
            },
            error: function (res) {
                console.log("请检查网络");
                $(".loading_dialog").remove();
            }
        });
        //console.log(e);
        //var storeAs = 'shop/evaluate/' + getImageName() + type;
        /*requestThisData("upload.htm", {folder: 'shop/evaluate/', imgFile: file}, function (data) {
            console.log(data);
        });*/


        /*client.multipartUpload(storeAs, file).then(function (result) {
            addImages(imgurl + storeAs, storeAs, obj);
        }).catch(function (err) {
            show_alert("服务器错误");
            console.log(err);
        });*/
    });
}

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

/**
 * 添加图片
 * @param url
 * @param name
 * @param obj
 */
function addImages(url, name, obj) {
    obj.before('<div class="img-box"><img src="' + url + '" alt="" data-src="' + name + '"/><i onclick="deleteUpload(this);">╳</i></div>');
    var inputObj = obj.siblings("input");
    var value = inputObj.val();
    if (value == "") {
        value = name;
    } else {
        value += "," + name;
    }
    inputObj.val(value);
}

/**
 * 星级
 * @param obj
 */
function clickThis(obj) {
    obj = $(obj);
    var index = obj.index();
    obj.addClass("check").prev("i").addClass("check").prev("i").addClass("check").prev("i").addClass("check").prev("i").addClass("check");
    obj.next("i").removeClass("check").next("i").removeClass("check").next("i").removeClass("check").next("i").removeClass("check");
    obj.siblings("input").val(index + 1);
}

/**
 * 删除图片
 * @param obj
 */
function deleteUpload(obj) {
    obj = $(obj);
    var url = obj.siblings("img").attr("data-src");
    var inputObj = obj.parent().siblings("input");
    var allUrl = inputObj.val();
    allUrl = allUrl.replace("," + url, "");
    allUrl = allUrl.replace(url, "");
    inputObj.val(allUrl);
    obj.parent(".img-box").remove();
}

/**
 * 加载数据
 */
function requestThisData() {
    if (!checkLogin(false)) {
        return false;
    }
    requestData("order_view.htm", {id: param.id}, function (data) {
        if (!data.success) {
            show_alert_back(data.msg);
            return false;
        }
        getGoodsHtml(data.data.gcs);
    });
}

/**
 * 获取html
 * @param list
 */
function getGoodsHtml(list) {
    $.each(list, function (i, v) {
        var html = '<div class="goodsCommitBox">' +
            getOrderInfoGoods([v], "javascript:void(0)") +
            '<h1 class="yourCommitTitle">您的评价</h1>' +
            '<textarea placeholder="亲！在这里留下您使用的感受哦~" class="ch" name="evaluate_info_' + v.id + '"></textarea>' +
            '<div class="order-refund-update">' +
            '<div class="upload-btn"><input type="file" id="file_' + v.id + '" name="imgFile" style="height: 100%; width: 100%; opacity: 0"></div>' +
            '<input type="hidden" value="" name="evaluate_pics_' + v.id + '"/>' +
            '<div class="clear"></div>' +
            '</div>' +
            '<div class="commitStar">' +
            '满意度' +
            '<span>' +
            '<i onclick="clickThis(this);"></i><i onclick="clickThis(this);"></i><i onclick="clickThis(this);"></i><i onclick="clickThis(this);"></i><i onclick="clickThis(this);"></i>' +
            '<input type="hidden" value="" name="description_evaluate_' + v.id + '" class="ch"/>' +
            '</span>' +
            '</div>' +
            '</div>';
        $("#postForm #box").append(html);
        bindSelectImage("file_" + v.id);
    });
}

/**
 * 提交评价
 * @return {boolean}
 */
function submitThisForm() {
    //验证表单
    var isSubmit = true;
    $(".ch").each(function () {
        if ($(this).val() == "") {
            isSubmit = false;
            return false;
        }
    });
    if (!isSubmit) {
        show_alert("请完善评价内容及满意度");
        return false;
    }
    requestData("order_evaluate.htm", $("#postForm").serialize(), function (data) {
        if (data.success) {
            show_alert_back("评价成功");
        } else {
            show_alert(data.msg);
        }
    });
}

/**
 * 匿名选择
 * @param obj
 */
function checkedThis(obj) {
    obj = $(obj);
    var anonymous = $("#anonymous");
    if (obj.hasClass("checked")) {
        obj.removeClass("checked");
        anonymous.val("0");
    } else {
        obj.addClass("checked");
        anonymous.val("1");
    }
}