var Sms = {
    getCode : function (inputName, obj) {
        obj = $(obj);
        if (obj.hasClass("no-click")) return ;
        var mobile = $("input[name='" + inputName + "']").val();
        var reg = new RegExp("^[1]\\d{10}$");
        if (!reg.test(mobile))  {com.alert("请输入正确的手机号码！", false); return false;}
        var timeNow = Date.now();
        sessionStorage.setItem("DLM_PC_TIME_NOW", timeNow);
        com.alert("验证码已发送至您的手机，请查收！");
        var s = 60;
        Sms.set(obj, s);
    },
    set : function (obj, s) {
        obj.addClass("no-click").html(s + "秒");
        var t =setInterval(function () {
            if (s <= 1) {
                clearInterval(t);
                obj.removeClass("no-click").html("获取验证码");
                return ;
            }
            obj.html(--s + "秒");
        }, 1000);
    }
};

new function () {
    var timeOld = sessionStorage.getItem("DLM_PC_TIME_NOW");
    console.log(timeOld);
    timeOld = timeOld ? timeOld : 0;
    var timeNow = Date.now();
    var _thisTime = 60 - parseInt((timeNow - timeOld) / 1000);
    if (_thisTime < 60 && _thisTime > 0) {
        var obj = $(".get_sms_code");
        Sms.set(obj, _thisTime);
    }
};