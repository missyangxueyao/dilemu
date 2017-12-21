
$(document).ready(function () {
    $("img:not(.avatar)").attr("onerror", "images/none-image.png");
    $("img.avatar").attr("onerror", "images/avatar-default.png");
});

var com = {
    timeOut : 1500,
    redirect: function (url, rep, target) {
        if (target == true) {
            window.open(url);
        } else if (rep == true) {
            location.replace(url);
        } else {
            window.location.href = url;
        }
    },
    showPhoto: function (images, i) {
        i = i ? i : 0;
        images = images ? images : 'http://dilemu-app.oss-cn-shanghai.aliyuncs.com/shop/goodslist/3f1410c7-11d3-4670-b7b8-23d2eedef4d8.jpg,http://dilemu-app.oss-cn-shanghai.aliyuncs.com/shop/goodslist/a8f95aa0-7ada-4e04-b789-6986a23c629a.jpg,http://dilemu-app.oss-cn-shanghai.aliyuncs.com/shop/goodslist/8e97eebb-9f44-429e-a188-010a2cb5a60b.jpg,http://dilemu-app.oss-cn-shanghai.aliyuncs.com/shop/goodslist/38f8ff49-7e0c-4c6b-b9f5-860dd0d27b3b.jpg,http://dilemu-app.oss-cn-shanghai.aliyuncs.com/shop/goodslist/da2dd850-1914-4fc9-bf45-464b6d4bf36f.jpg,http://dilemu-app.oss-cn-shanghai.aliyuncs.com/shop/evaluate/0ce0f653-ab03-4d3d-86c8-f0499de0e9a6.jpg';
        images = images.split(",");
        var imagesHtml = '';
        $.each(images, function (j, v) {
            imagesHtml += '<div class="swiper-slide" style="background-image:url(' + v + ')"></div>';
        });
        var html = '<div class="photo_album"><div class="photo_album_box"><div class="close" onclick="com.photoClose();">╳</div><div class="swiper-container gallery-top"><div class="swiper-wrapper">' + imagesHtml + '</div><div class="swiper-button-next swiper-button-white"></div><div class="swiper-button-prev swiper-button-white"></div></div><div class="swiper-container gallery-thumbs"><div class="swiper-wrapper">' + imagesHtml + '</div></div></div></div></div>';
        $("body").append(html);
        var galleryTop = new Swiper('.gallery-top', {
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            spaceBetween: 10,
            initialSlide: i

        });
        var galleryThumbs = new Swiper('.gallery-thumbs', {
            spaceBetween: 10,
            centeredSlides: true,
            slidesPerView: 'auto',
            touchRatio: 0.2,
            slideToClickedSlide: true,
            initialSlide: i
        });
        galleryTop.params.control = galleryThumbs;
        galleryThumbs.params.control = galleryTop;
    },
    photoClose: function () {
        $(".photo_album").remove();
    },
    formatPrice: function (price) {
        return parseFloat(price).toFixed(2);
    },
    alert: function (msg, result, local_url, time, renovate, title) {
        var iconClass = "success-icon";
        if (result === false) {
            iconClass = "error-icon";
        }
        if (title == "" || title == null || title == undefined) {
            title = "提示信息";
            if (result === false) {
                title = "错误信息";
            }
        }
        var alertHtml = '<div class="show_alert"><div class="alert_content"><h1>' + title + '</h1><i class="' + iconClass + '"></i><div class="table_cel"><h2>' + msg + '</h2></div></div></div>';
        $("body").append(alertHtml);
        time = parseInt(time) > 0 ? parseInt(time) : this.timeOut;
        var i = 0;
        var setI = setTimeout(function () {
            $('.show_alert').remove();
            if (renovate == true) {
                location.reload();
            }
            if (local_url != "" && local_url != undefined && local_url != null) {
                window.location.href = local_url;
            }
            if (i >= 1) {
                clearTimeout(setI);
            }
            i++;
        }, time);
    }
};



