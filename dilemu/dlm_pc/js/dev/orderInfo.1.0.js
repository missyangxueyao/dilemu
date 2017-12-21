new function () {
    $("#zclip_copy").zclip({
        path: "js/zclip/ZeroClipboard.swf",
        copy: function(){
            return $(this).attr("data-data");
        },
        afterCopy:function(){/* 复制成功后的操作 */
            var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
            $("body").find(".copy-tips").remove().end().append($copysuc);
            $(".copy-tips").fadeOut(3000);
        }
    });
};

var OA = {
    payment: function (obj) {
        obj = $(obj);
        if (obj.hasClass("check")) return;
        obj.addClass("check").siblings(".check").removeClass("check");
    }
};