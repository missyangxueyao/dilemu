new function () {
    var _this = this;
    var hoverData = {};
    _this.co = function (sColor) {
        var sColorChange = [];
        for(var i=0; i<6; i+=2){
            sColorChange.push(parseInt("0x"+sColor.substr(i,2)));
        }
        return sColorChange.join(",");
    };
    $("#all_class_btn > a").hover(function () {
        hoverData.obj = $(this);
        hoverData.image = hoverData.obj.children("img").attr("src");
        hoverData._image = hoverData.obj.attr("data-img");
        hoverData.color = hoverData.obj.attr("data-color");
        hoverData.obj.css({"color": "#FFFFFF", "box-shadow": "3px 3px 15px rgba(" + _this.co(hoverData.color) + ", 0.7)", "background": "#" + hoverData.color})
        hoverData.obj.children("img").attr("src", hoverData._image);
    }, function () {
        hoverData.obj.css({"color": "#"+hoverData.color, "box-shadow": "none", "background": "transparent"});
        hoverData.obj.children("img").attr("src", hoverData.image);
    });
    $(".goods-sort a").click(function () {
        var obj = $(this);
        if (obj.hasClass("sort")) return false;
        obj.addClass("sort").siblings(".sort").removeClass("sort");
    });
};