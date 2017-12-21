!function () {
    var n = $("#loadScript").attr("data-param");
    if (n != "" && n != null) {
        $("#top .nav a[data-param='" + n + "']").addClass("check").attr("onclick", "return false");
    }
}();
var m = function (e) {
    $(e).siblings("a.more").addClass("hover");
};
var n = function (e) {
    $(e).siblings("a.more").removeClass("hover");
};
