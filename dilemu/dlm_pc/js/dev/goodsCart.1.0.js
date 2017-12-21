var car = {
    num : function (id, type, price) {
        var obj = $("#num_" + id);
        var value = parseInt(obj.val());
        if (type) {
            value++;
        } else {
            value = value > 1 ? value - 1 : value;
        }
        obj.val(value);
        this.onePrice(id, value, price);
    },
    onePrice : function (id, num, price) {
        var obj = $("#allPrice_" + id);
        obj.html("￥" + com.formatPrice(num * price));
    },
};

var car_step2 = {
    checkAdd : function (obj, type) {
        obj = $(obj);
        if (obj.hasClass("check")) return;
        obj.addClass("check").siblings(".check").removeClass("check");
        if (type) {
            $(".newAddressInfo").show();
        } else {
            $(".newAddressInfo").hide();
        }
    },
    payment : function (obj) {
        obj = $(obj);
        if (obj.hasClass("check")) return;
        obj.addClass("check").siblings(".check").removeClass("check");
    },
    integral: function (obj) {
        obj = $(obj);
        if (obj.hasClass("check")) {
            obj.removeClass("check");
        } else {
            obj.addClass("check");
        }
    },
    coupon : function (obj) {
        obj = $(obj);
        if (obj.hasClass("check")) return;
        obj.addClass("check").siblings(".check").removeClass("check");
    }
};