
new function () {
    var _self = this;
    _self.width = 1000;
    _self.widthProportion =  function() {return document.body&&document.body.clientWidth||document.getElementsByTagName("html")[0].offsetWidth;}
    _self.boxWidth = function() {return _self.widthProportion() > _self.width ? _self.widthProportion() : _self.width};
    _self.changePage = function () {
        var right = (_self.boxWidth() - _self.width) / 2 + 38;
        $("iframe.easemobim-chat-panel").css("right", right + "px");
    };
    window.addEventListener('resize',function(){_self.changePage();},false);
    _self.hxInitStar = 0;

    $(".member-message .title").click(function () {
        var _this = $(this);
        if (_this.hasClass("check")) return;
        _this.addClass("check").siblings(".check").removeClass("check");
        var type = _this.attr("data-type");
        if (type === "sys") {
            $("#system_msg_box").show();
            $("#custom_msg_box").hide();
            $(".easemobim-chat-panel").addClass("hidden");
        } else {
            $("#system_msg_box").hide();
            $("#custom_msg_box").show();
            $(".easemobim-chat-panel").removeClass("hidden");
            if (_self.hxInitStar === 0) {
                hxInit();
                _self.changePage();
                _self.hxInitStar = 1;
            }
        }
    });
};