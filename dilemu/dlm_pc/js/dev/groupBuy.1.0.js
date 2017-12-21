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
};