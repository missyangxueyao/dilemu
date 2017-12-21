var ret = {
    imagesUrl: '',
    imageNum: 0,
    checkPriceValue: function (obj) {
        var value = obj.value;
        var _value = parseFloat(value);
        if (_value != value) {
            obj.value = _value.toFixed(2);
            return ;
        }
        if (_value < 0) {
            obj.value = 0.00;
            return ;
        }
        if (_value > allPrice) {
            obj.value = allPrice.toFixed(2);
            return false;
        }
    },
    upload: function (p_id, img_id, valueId) {
        var time = new Date();
        var imgUrl = "https://dilemu-app.oss-cn-shanghai.aliyuncs.com/";
        var header = {
            "clientVersion": "1.0",
            "requestTime": time,
            "serviceVersion": "1.0",
            "sourceID": "101",
            "userToken": 'a87bb210-e7e2-4901-ae45-8ea7054c45c9',
            "folder": "shop/service"
        };
        $.ajaxFileUpload({
            url: "https://shop.delightmom.com/hsshop/api/upload.htm",
            dataType: "json",
            secureuri: false,
            fileElementId: img_id,
            data: header,
            success: function (result) {
                ret.addImages(imgUrl + result.data, result.data, p_id);
                ret.imagesUrl = $("#" + valueId).val();
                if (ret.imagesUrl === "") {
                    ret.imagesUrl = result.data;
                } else {
                    ret.imagesUrl += "," + result.data;
                }
                $("#" + valueId).val(ret.imagesUrl);
                $("#" + img_id).val("");
            },
            error: function (res) {
                console.log("请检查网络");
            }
        });
    },
    addImages: function (url, name, id) {
        var obj = $("#" + id);
        obj.before('<span class="upload-btn"><img src="' + url + '" alt="" onerror="this.src=\'images/none-image.png\'" data-src="' + name + '"/><a href="javascript:void(0);" onclick="ret.remove(this);">删除</a></span>');
        ret.imageNum++;
        if (ret.imageNum >= 5) {
            obj.remove();
        }
    },
    remove: function (obj) {
        obj = $(obj);
        var url = obj.siblings("img").attr("data-src");
        var inputObj = obj.parent().siblings("input");
        var allUrl = inputObj.val();
        allUrl = allUrl.replace("," + url, "");
        allUrl = allUrl.replace(url, "");
        inputObj.val(allUrl);
        ret.imagesUrl = allUrl;
        obj.parent().remove();
    },
    star: function (obj) {
        obj = $(obj);
        var i = obj.index();
        obj.addClass("checked").siblings("i:lt(" + i + ")").addClass("checked");
        obj.siblings("i:gt(" + (i - 1) + ")").removeClass("checked");
        obj.siblings("input").val(i);
    },
    check: function (obj) {
        obj = $(obj);
        if (obj.hasClass("checked")) obj.removeClass("checked"); else obj.addClass("checked");
    }
};