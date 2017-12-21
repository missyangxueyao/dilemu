var find = {
    reg: new RegExp("^[1]\\d{10}$"),
    confirm: function () {
        var mobile = $('input[name="phone"]').val();
        if (!find.reg.test(mobile))  {com.alert("请输入正确的手机号码！", false); return false;}
        var smsCode = $('input[name="sms_code"]').val();
        if (smsCode === "") {com.alert("请输入验证码！", false); return false;}
        return true;
    }
};