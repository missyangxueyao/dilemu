new function () {
    var swiper = new Swiper('.goods-swiper-image', {
        pagination: '.swiper-pagination',
        paginationClickable: '.swiper-pagination',
        spaceBetween: 2,
        centeredSlides: true,
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
    });

    /*var swiperLimit = new Swiper('#likeGoods', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 6.5,
        spaceBetween: 43,
        paginationClickable: true,
        simulateTouch: false,
    });*/

    var video = new videoPlay('.playVideo', {
        url: "http://dilemu-app.oss-cn-shanghai.aliyuncs.com/shop/goodsVideo/2182aa3f-4f50-40ff-8f3b-555689ec2e65.mp4",
        width: 700,
        height: 450,
        background: "rgba(0,0,0,0.8)"
    });

    $("#gcsInfo > span").click(function () {Det.spec(this);});
};

var Det = {
    spec: function (obj) {
        obj = $(obj);
        if (obj.hasClass("check")) return;
        obj.addClass("check").siblings(".check").removeClass("check");
    },
    num: function (type, obj) {
        obj = $(obj).siblings(".num");
        var number = parseInt(obj.text());
        if (type === 0) {number > 1 ? obj.text(--number) : false} else {obj.text(++number)}
    },
    check: function (obj) {
        obj = $(obj);
        if (obj.hasClass("check")) obj.removeClass("check"); else obj.addClass("check");
    }
};