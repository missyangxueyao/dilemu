/**
 * Created by ZhuXueSong on 2017/6/27.
 */

var allAddressJson = [];
var thisAddressId = 0;
var isDefault = 0;


/**
 * 加载地址列表
 */
function loadAllAddressList() {
    if (!checkLogin(false)) {
        return false;
    }
    requestData("address.htm", {pageSize: 10000}, function (data) {
        if (!data.success) {
            $("#none_order").show();
            return false;
        }
        var html = '';
        allAddressJson = data.data.recordList;
        $.each(allAddressJson, function (i, v) {
            html += '<div class="orders-info-address address-list">' +
                '<div onclick="selectThisAddress(' + i + ', ' + v.id + ');"> <h1>' + v.trueName + ' &nbsp; ' + v.mobile + '</h1>' +
                '<h2>' + getAddress(v) + '</h2> </div> </div>';
        });
        $("#addressList .address-list").remove();
        $("#addressList").append(html);
    });
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
 * 获取地区信息
 * @param address
 * @return {object}
 */
function getAllArea(address) {
    if (!address) {
        return "";
    }
    var text = "";
    var areaId = "";
    if (address.area) {
        if (address.area.parent) {
            if (address.area.parent.parent) {
                text += address.area.parent.parent.areaName + " ";
                areaId += address.area.parent.parent.id + ",";
            }
            text += address.area.parent.areaName + " ";
            areaId += address.area.parent.id + ",";
        }
        text += address.area.areaName + " ";
        areaId += address.area.id + ",";
    }
    return {text: text, areaId: areaId};
}

/**
 * 保存地址信息，以便下一页面使用
 * @param i
 * @param id
 */
function selectThisAddress(i, id) {
    sessionStorage.setItem("addressInfo", JSON.stringify(allAddressJson[i]));
    redirect("address_info.html?id=" + id);
}

function setAddressInfo(id) {
    var addressInfo = JSON.parse(sessionStorage.getItem("addressInfo"));
    thisAddressId = id;
    $(".head-right").attr("data-id", id);
    $("#realName").val(addressInfo.trueName);
    $("#mobile").val(addressInfo.mobile);
    var areaInfo = getAllArea(addressInfo);
    $("#area").val(areaInfo.text).attr("data-value", areaInfo.areaId);
    $("#areaInfo").val(addressInfo.area_info);
    if (addressInfo.def) {
        isDefault = 1;
        $(".icon-default-address").addClass("checked");
    }
}

/**
 * 默认地址选择
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
            show_alert_back("删除成功");
        } else {
            show_alert(data.msg);
        }
    })
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
 * 保存地址信息
 * @return {boolean}
 */
function saveAddressInfo() {
    var trueName = $("#realName").val();
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
    if (thisAddressId > 0) {
        postData.id = parseInt(thisAddressId);
    }
    requestData("address_save.htm", postData, function (data) {
        if (!data.success) {
            show_alert(data.msg);
            return false;
        }
        show_alert_back("操作成功");
    });
}
