/**
 * Created by ZhuXueSong on 2017/7/13.
 */

if (checkLogin(true)) {
    getReferrer();
}

var bindUserInfo = '';

/**
 * input输入框
 * @param obj
 * @param type
 */
function inputOnKeyUp(obj, type) {
    var _obj = $(obj);
    if (obj.value !== "") {
        _obj.siblings(".icon-close").show();
    } else {
        _obj.siblings(".icon-close").hide();
    }
    if (type) {
        _obj.siblings("input").val(obj.value);
    }

    var all = true;
    $("input").each(function () {
        if ($(this).val() == "" && $(this).attr("id") != 'invite_code') {
            all = false;
        }
    });
    if (all) {
        $(".login-btn").addClass("red");
    } else {
        $(".login-btn").removeClass("red");
    }
}

/**
 * 清除输入框的内容
 * @param obj
 */
function clearSiblingInput(obj) {
    obj = $(obj);
    obj.siblings("input").val("");
    obj.hide();
    if (obj.siblings("input").attr("id") != "invite_code") {
        $(".login-btn").removeClass("red");
    }
}

/**
 * password 的影藏与显示
 * @param obj
 * @param id
 */
function passwordShow(obj, id) {
    obj = $(obj);
    if (!id) {
        id = "password";
    }
    if (obj.hasClass("show")) {
        $("#" + id).show();
        $("#" + id + "_").hide();
        obj.removeClass("show");
    } else {
        $("#" + id).hide();
        $("#" + id + "_").show();
        obj.addClass("show");
    }
}

/**
 * 获取验证码
 * @param obj
 * @param type 1 登录，2 找回密码;
 * @return {boolean}
 */
function getMobileCode(obj, type) {
    obj = $(obj);
    if (obj.hasClass("no-click")) {
        return false;
    }
    var url = '';
    if (type == 1) {
        url = "/verifycode/register";
    } else if (type == 2) {
        url = "/verifycode/password/modify";
    } else if (type == 3) {
        url = "/verifycode/phone/bind";
    } else {
        show_alert("参数错误");
        return false;
    }
    var phone = $("#mobile").val();
    if (phone.length != 11) {
        show_alert("请输入正确的手机号码");
        return false;
    }
    _requestData(url, {phone: phone}, function (data) {
        if (data.header.resultCode == 0) {
            show_alert("验证吗已发送至您的手机，请查收");
            var s = 60;
            obj.html("等待 " + s + " 秒").addClass("no-click");
            var int = setInterval(function () {
                if (s <= 1) {
                    obj.html("获取验证码").removeClass("no-click");
                    clearInterval(int);
                } else {
                    s--;
                    obj.html("等待 " + s + " 秒");
                }
            }, 1000);
        } else {
            show_alert(data.header.resultText);
        }
    })
}


/**
 * 用户登录注册使用的ajax请求数据类
 * @param url
 * @param data
 * @param calBackFunction
 * @param async
 */
function _requestData(url, data, calBackFunction, async) {
    url = config.wwwHost + url;
    if(async == null || async == undefined){
        async = true;
    }
    var time = Date.now();
    data.header = {
        "clientVersion": "1.0",
        "requestTime": time,
        "serviceVersion": "1.0",
        "sourceID": "101",
        "userToken": _token
    };
    data = JSON.stringify(data);
    $.ajax({
        contentType: "application/json; charset=utf-8",
        type: "POST",
        url: url,
        data: data,
        //headers: header,
        dataType: "JSON",
        //async: async,
        beforeSend : function(){
            $("body").append(loading_html);
        },
        success : function(json){
            calBackFunction(json);
            $(".loading_dialog").remove();
        },
        error : function(XMLHttpRequest){
            $(".loading_dialog").remove();
            console.log(XMLHttpRequest);
            show_alert('请检查网络');
        }
    });
}

/**
 * 登录操作
 */
function loginAction() {
    var phone = $("#mobile").val();
    if (phone.length != 11) {
        show_alert("请输入正确的手机号码");
        return false;
    }
    var password = $("#password").val();
    if (password == "") {
        show_alert("请输入登录密码");
        return false;
    }
    _requestData("appuser/login/pwd", {phone: phone, password: password}, function (data) {
        if (data.header.resultCode == 0) {
            loginSuccess(data.userInfo, 1);
        } else {
            show_alert(data.header.resultText);
        }
    });
}

/**
 * 注册操作
 * @return {boolean}
 */
function registerAction() {
    var phone = $("#mobile").val();
    if (phone.length != 11) {
        show_alert("请输入正确的手机号码");
        return false;
    }
    var password = $("#password").val();
    if (password == "") {
        show_alert("请输入登录密码");
        return false;
    }
    var verifyCode = $("#sms_code").val();
    if (verifyCode == "") {
        show_alert("请输入短信验证码");
        return false;
    }
    var inviteCode = $("#invite_code").val();
    _requestData("appuser/register", {phone: phone, password: password, verifyCode: verifyCode, inviteCode: inviteCode}, function (data) {
        if (data.header.resultCode == 0) {
            loginSuccess(data.userInfo, 2);
        } else {
            show_alert(data.header.resultText);
        }
    })
}

/**
 * 登录成功后跳转页面
 * @param data
 * @param back
 * @param url
 */
function loginSuccess(data, back, url) {
    sessionStorage.setItem("DiLeMu_userData", JSON.stringify(data));
    sessionStorage.setItem("DiLeMu_userToken", data.userToken);
    if (url) {
        redirect(url, true);
    } else {
        back = back ? back : 1;
        location.reload();
        history.go(-back);
    }
}

/**
 * 验证身份
 * @return {boolean}
 */
function checkVerify() {
    var phone = $("#mobile").val();
    if (phone.length != 11) {
        show_alert("请输入正确的手机号码");
        return false;
    }
    var verifyCode = $("#sms_code").val();
    if (verifyCode == "") {
        show_alert("请输入短信验证码");
        return false;
    }
    _requestData("verifycode/password/check", {phone: phone, verifyCode: verifyCode}, function (data) {
        if (data.header.resultCode == 0) {
            show_alert("身份验证成功");
            $(".reset-dialog").show();
        } else {
            show_alert(data.header.resultText);
        }
    })
}
/**
 * 找回密码
 */
function findPassword() {
    var phone = $("#mobile").val();
    if (phone.length != 11) {
        show_alert("请输入正确的手机号码");
        return false;
    }
    var verifyCode = $("#sms_code").val();
    if (verifyCode == "") {
        show_alert("请输入短信验证码");
        return false;
    }
    var password = $("#password").val();
    if (password == "") {
        show_alert("请输入新密码");
        return false;
    }
    if (password !== $("#password_again").val()) {
        show_alert("两次密码输入不一致");
        return false;
    }
    _requestData("appuser/pwd/modify/sms", {phone: phone, verifyCode: verifyCode, password: password}, function (data) {
        if (data.header.resultCode == 0) {
            show_alert_back("操作成功");
        } else {
            show_alert(data.header.resultText);
        }
    })
}

/**
 * 微信登录
 */
function getWeChatInfo() {
    var param = get_param();
    var _url = sessionStorage.getItem('DiLeMu_thisUri');
    _url = _url ? _url : "index.html";
    if (param.code) {
        _requestData("weixin/mp/login", {code: param.code}, function (data) {
            if (data.header.resultCode == 0) {
                if (data.userInfo.phoneBind) {
                    var redirect_url = sessionStorage.getItem("DiLeMu_thisUri");
                    redirect_url = redirect_url ? redirect_url : "index.html";
                    loginSuccess(data.userInfo, "", redirect_url);
                } else {
                    //绑定手机号
                    bindUserInfo = data.userInfo;
                    _token = bindUserInfo.userToken;
                    $("#box").show();
                }
            } else {
                show_alert(data.header.resultText);
            }
        })
    } else {
        redirect(_url);
    }
}

function bindUserPone() {
    var phone = $("#mobile").val();
    if (phone.length != 11) {
        show_alert("请输入正确的手机号码");
        return false;
    }
    var verifyCode = $("#sms_code").val();
    if (verifyCode == "") {
        show_alert("请输入短信验证码");
        return false;
    }
    _requestData("appuser/phone/bind/modify", {phone: phone, verifyCode: verifyCode}, function (data) {
        if (data.header.resultCode == 0) {
            bindUserInfo.phoneBind = phone;
            var redirect_url = sessionStorage.getItem("DiLeMu_thisUri");
            redirect_url = redirect_url ? redirect_url : "index.html";
            loginSuccess(bindUserInfo, "", redirect_url);
        } else {
            show_alert(data.header.resultText);
        }
    })
}
