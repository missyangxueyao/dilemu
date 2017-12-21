new function () {
    var swiper = new Swiper('#banner .swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        simulateTouch: false
    });

    var swiperGoods = new Swiper('.swiper-goods', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 32,
        simulateTouch: false,
    });

    /*var swiperLimit = new Swiper('.buyLimit-goods', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 2.4,
        paginationClickable: true,
        spaceBetween: 30,
        simulateTouch: false,
    });*/

    $(".buyLimit-title > span").click(function () {
        var obj = $(this);
        if (obj.hasClass("check")) {
            return false;
        }
        obj.addClass("check").siblings("span.check").removeClass("check");
    });
};

