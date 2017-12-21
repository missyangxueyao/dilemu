/**
 * Created by ZhuXueSong on 2017/6/21.
 */
var param = get_param();

var pageNumber = 1;
var totalPage = 1;
var bodyHeight = document.body.clientHeight;
var listHeight = 0;
var gc_id;
var isLoding = false;
var gc_num;

getClass();
function getClass() {
    /***********导航列表接口**************/
    requestData("goodsClass.htm", {}, function (data) {
        if(data.success == true){
            var result = data.data;
            var navul = '<ul id="nav_top" ></ul>'
            $(".nav").append(navul);
            var navli = "";
            var swipersilde = '';
            $.each(result, function (i, v) {
                //            i相当于，v相当于result[i]
                navli += '<li data-id="' + v.id + '" data-num="' + v.childNum + '">' + v.className + '</li>'
                swipersilde +='<div class="swiper-slide" data-type="' + v.id + '"></div>'
            });
            $("#nav_top").html(navli);
            $("#tabs-container .swiper-wrapper").append(swipersilde)
            navclick();
            setBannerWidth();
            if (param.id && param.id != result[0].id) {
                $("#nav_top li[data-id='" + param.id + "']").click();
            } else {
                getData(result[0].id);
            }
        }else {
            show_alert(data.msg)
        }
    }, false);
}
function getData(id, num) {
    $(".load_more").remove();
    gc_id = id;
    gc_num = num;
    /***********首页主要内容接口**************/
    if (num != -1 && num != 0) {
        requestData("goodsClass.htm", {gc_id: id}, function (data) {
            if(data.success == true){
                var result = data.data;
                var tabcontent = '<div class="tabContent_' + id + '"  style="display: block;"></div>'
                $("#tabs-container .swiper-wrapper .swiper-slide[data-type='" + id + "']").html(tabcontent)
                var html = "";
                for (var d in result.newGoods) {
                    html += '<div class="banner">' +
                        '<img onerror="this.src=\'images/none-image.png\'" src="' + imgurl + result.newGoods[d].goods.mainPhotoPath + '">' +
                        '<div class="bannerPopup index-bannerpop">' +
                        '<h1>' + result.newGoods[d].goods.goods_name + '</h1>' +
                        '<p></p>' +
                        '<h2>' + result.newGoods[d].goods.className + '</h2>' +
                        '<a href="goodsdetail.html?id=' + result.newGoods[d].goods.id + '">查看详情</a>' +
                        '</div>' +
                        '</div>'
                    var goodsList = result.newGoods[d].goods_list;
                    html += '<div class="container containerList">' +
                        '<div class="swiper-container swiper-youer">' +
                        '<div class="swiper-wrapper">';
                    for (var i = 0; i < goodsList.length; i++) {
                        html += '<div class="swiper-slide swiper-goods">' +
                            '<a href="goodsdetail.html?id=' + goodsList[i].id + '">' +
                            '<img onerror="this.src=\'images/none-image.png\'" src="' + imgurl + goodsList[i].mainPhotoPath + '" alt="">' +
                            '<h1>' + goodsList[i].goods_name + '</h1>' +
                            '<p>'+goodsList[i].className+'</p>' +
                            '<p>￥' + formatPrice(goodsList[i].goods_price)+ '</p>' +
                            '</a>' +
                            '</div>';
                    }
                    html += '</div>' +
                        '</div>' +
                        '</div>';
                    $(".tabContent_" + id).html(html);
                }

                smallbanner();
            }else{
                show_alert(data.msg)
            }
        }, false);
    } else if (num == -1) {
        requestData("goodsClass.htm", {gc_id:id}, function (data) {
            if(data.success == true){
                $("#tabs-container .swiper-wrapper .swiper-slide[data-type='-1']").addClass('nearnew')
                var result = data.data;
                var newbannerBox = '<div class="newbanner-box"></div>' +
                    '<div class="flashSale"></div>' +
                    '<div class="teamBuy"></div>'+
                    '<div class="tabContent"  style="display: block;"></div>'

                $("#tabs-container .swiper-wrapper .swiper-slide[data-type='-1']").html(newbannerBox);
                /**********banner轮播图**********/
                var bannersilder = '<div class="swiper-container new-container"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div></div>'
                $(".newbanner-box").html(bannersilder)
                var bannerImg = "";
                for(b in result.banner){
                    bannerImg  += '<div class="swiper-slide new-banner"><img onerror="this.src=\'images/none-image.png\'" src="'+imgurl+result.banner[b].imgSrc+'" alt="" ' + (result.banner[b].url ? 'onclick="redirect(\'' + result.banner[b].url + '\')"' : '') + '></div>'
                }
                $(".new-container").find('.swiper-wrapper').html(bannerImg)
                newbanner();
                /**********限时抢购**********/
                if (result.apiSpecials.length > 0) {
                    var flash = '<h1 onclick="redirect(\'buyLimit.html\')">- 今日限时抢购 -</h1>'+
                        '<div id="clock" onclick="redirect(\'buyLimit.html\')"></div>' +
                        '<div class="swiper-container swiper-container-horizontal new-flashSalebanner">' +
                        '<div class="swiper-wrapper"></div>' +
                        '</div>'
                    $(".flashSale").html(flash);
                    var specialsimg = result.apiSpecials[0].apiSpecialGoods;
                    if (specialsimg.length > 0) {
                        var flashSale = '';
                        for (i in specialsimg) {
                            flashSale += '<div class="swiper-slide"><img onerror="this.src=\'images/none-image.png\'" src="' + imgurl + specialsimg[i].mainPhotoPath + '" class="main-img" onclick="redirect(\'goodsdetail.html?id=' + specialsimg[i].goods_id + '\')"/></div>'
                        }
                        $(".new-flashSalebanner .swiper-wrapper").html(flashSale)
                        flashSwiper();
                    }
                    //倒计时
                    var endtime = result.apiSpecials[0].endTime
                    $('#clock').countdown(endtime, function (event) {
                        var totalHours = event.offset.totalDays * 24 + event.offset.hours;
                        $(this).html(event.strftime(
                            '<span>' + totalHours + '</span>: '
                            + '<span>%M</span>: '
                            + '<span>%S</span>'
                        ));
                    });
                }


                /*****************团购******************/
                if (result.apiHsGroups.length > 0) {
                    var teambuy = '<h2 class="teamBuy-title">- 超值团购 -</h2>' +
                        '<a href="teambuy.html">' +
                        '<img onerror="this.src=\'images/none-image.png\'" src="' + config.imageUrl + result.groupBanner.imgSrc + '" alt="" class="team-img">' +
                        '</a>' +
                        '<div class="container containerList teamBuy-silder">' +
                        '<div class="swiper-container swiper-youer">' +
                        '<div class="swiper-wrapper">' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    $(".teamBuy").html(teambuy)
                    var teambuySlider = '';
                    for (i in result.apiHsGroups) {
                        teambuySlider += '<div class="swiper-slide swiper-goods">' +
                            '<a href="goodsdetail.html?id=' + result.apiHsGroups[i].goods_id + '">' +
                            '<img onerror="this.src=\'images/none-image.png\'" src="' + imgurl + result.apiHsGroups[i].image + '">' +
                            '<h1>' + result.apiHsGroups[i].goods_name + '</h1>' +
                            '<p>' + result.apiHsGroups[i].className + '</p>' +
                            '<p>￥' + formatPrice(result.apiHsGroups[i].goods_price* result.apiHsGroups[i].rebate) + '</p>' +
                            '</a>' +
                            '</div>';
                    }
                    $(".teamBuy-silder .swiper-youer .swiper-wrapper").html(teambuySlider);
                }
                /**********************商品列表**********************/
                var html = "";
                for (var d in result.newGoods) {
                    html += '<div class="banner">' +
                        '<img onerror="this.src=\'images/none-image.png\'" src="' + imgurl + result.newGoods[d].goods.mainPhotoPath + '" >' +
                        '<div class="bannerPopup index-bannerpop">' +
                        '<h1>' + result.newGoods[d].goods.goods_name + '</h1>' +
                        '<p></p>' +
                        '<h2>' + result.newGoods[d].className + '</h2>' +
                        '<a href="goodsdetail.html?id=' + result.newGoods[d].goods.id + '">查看详情</a>' +
                        '</div>' +
                        '</div>'

                    html += '<div class="container containerList">' +
                        '<div class="swiper-container swiper-youer">' +
                        '<div class="swiper-wrapper">'
                    var goodsList = result.newGoods[d].goods_list;
                    for (var i = 0; i < goodsList.length; i++) {
                        html += '<div class="swiper-slide swiper-goods">' +
                            '<a href="goodsdetail.html?id=' + goodsList[i].id + '">' +
                            '<img onerror="this.src=\'images/none-image.png\'" src="'+ imgurl + goodsList[i].mainPhotoPath + '" alt="">' +
                            '<h1>' + goodsList[i].goods_name + '</h1>' +
                            '<p>'+goodsList[i].className+'</p>' +
                            '<p>￥' + formatPrice(goodsList[i].goods_price) + '</p>' +
                            '</a>' +
                            '</div>'
                    }
                    html += '</div>' +
                        '</div>' +
                        '</div>'
                }
                $(".tabContent").html(html);
//                    $(".tabContent .containerList .swiper-wrapper").html(htmlc)
                smallbanner();
                $(".tab-show").click();
            }else{
                show_alert(data.msg)
            }

        }, false);
    } else {
        requestGoodsData(id, 1);
    }
}
/***************** 导航宽度设置 *****************/
function setBannerWidth() {
    var nav_top_width = 0;
    var htmlSize = parseFloat($('html').css("font-size"));
    var obj = $("#nav_top");
    var width = 0;
    $("#nav_top li").each(function(){
        width += parseFloat($(this).css("width")) + htmlSize * 0.62;
    });
    obj.css("width", width + "px");
}
/****************导航切换*****************/
function navclick(){
    var tabsSwiper = new Swiper('#tabs-container',{
        speed:500,
        autoHeight:true,
        onSlideChangeStart: function(){
            var id = $(".nav li").eq(tabsSwiper.activeIndex).attr('data-id');
            var num = $(".nav li").eq(tabsSwiper.activeIndex).attr('data-num');
            $(".nav li").removeClass('tab-show');
            $(".nav li").eq(tabsSwiper.activeIndex).addClass('tab-show');
            $(".nav").scrollLeft($(".nav li").eq(tabsSwiper.activeIndex).offset().left-$('#nav_top').offset().left-$(window).width()/2);
            history.replaceState("", "", "index.html?id=" + id);
            getData(parseInt(id), parseInt(num));
        },
    })
    $(".nav li").eq(0).addClass('tab-show')
    $(".nav li").on('click',function(e){
        e.preventDefault()
        $(".nav li").removeClass('tab-show')
        $(this).addClass('tab-show')
        tabsSwiper.slideTo( $(this).index() )
    });
}

/****************最新部分的banner轮播部分*****************/
function newbanner(){
    var newSwiper = new Swiper('.new-container', {
        direction: 'horizontal',
        loop: true,
        pagination: '.swiper-pagination',//分页显示设置
        paginationClickable:true,
        autoplay: 3000,
        nested:true,
        autoplayDisableOnInteraction:false,
        resistanceRatio:0
    })
}
/****************最新部分的banner轮播部分结束*****************/
/****************banner下面的小图片滑动*****************/
function smallbanner(){
    var mySwiper = new Swiper ('.swiper-youer', {
        slidesPerView: 'auto',
        spaceBetween: 0,
    });
}
/****************banner下面的小图片滑动结束*****************/
/*限时抢购轮播图*/
function flashSwiper(){
    var flashSwiper = new Swiper(".new-flashSalebanner", {
        slidesPerView: "auto",
        spaceBetween:30,
        loop : true,
        pagination: '.new-flashSalepagination',//分页显示设置
        centeredSlides : true,
        watchSlidesProgress: !0,
//            切换结束时变换
        onSlideChangeStart: function(swiper){
            $(".new-flashSalebanner .swiper-slide").eq(swiper.activeIndex+1).addClass('img').removeClass('imgs')
            $(".new-flashSalebanner .swiper-slide").eq(swiper.activeIndex-1).addClass('img').removeClass('imgs')
            $(".new-flashSalebanner .swiper-slide").eq(swiper.activeIndex).removeClass('img').addClass('imgs')
        },
//            拖动进程中变换
        onProgress: function(swiper){
            $(".new-flashSalebanner .swiper-slide").eq(swiper.activeIndex+1).addClass('img').removeClass('imgs')
            $(".new-flashSalebanner .swiper-slide").eq(swiper.activeIndex-1).addClass('img').removeClass('imgs')
            $(".new-flashSalebanner .swiper-slide").eq(swiper.activeIndex).removeClass('img').addClass('imgs')
        },
    });
}



function requestGoodsData(id, page) {
    requestData("listGoods.htm", {gc_id: id, currentPage: page}, function (data) {
        if (!data.success) {
            show_alert(data.msg);
            return false;
        }
        totalPage = data.data.totalPage;
        data = data.data.recordList;
        if (page == 1) {
            var box = '<div class="tabContent_' + id + '"  style="display: block;"></div>';
            $("#tabs-container .swiper-wrapper .swiper-slide[data-type='" + id + "']").html(box);
            var obj = $(".tabContent_" + id);
            obj.append('<div class="banner"><img onerror="this.src=\'images/none-image.png\'" src="' + imgurl + data[0].mainPhotoPath + '"><div class="bannerPopup index-bannerpop"><h1>' + data[0].className + '</h1><p></p><h2>' + data[0].goods_name + '</h2><a href="goodsdetail.html?id=' + data[0].id + '">查看详情</a></div></div><div class="indexGoodsListBox indexGoodsListBox_' + id + '"></div><div class="load_more" id="load_more"></div>');
            var newData = [];
            for (var i = 0; i < data.length - 1; i++) {
                newData[i] = data[i + 1];
            }
            data = newData;
            $('.indexGoodsListBox_' + id).html(getGoodsList(data));
        } else {
            $('.indexGoodsListBox_' + id).append(getGoodsList(data));
        }
        listHeight = document.getElementById("load_more").offsetTop;
        isLoding = false;
    }, false);
}

function getGoodsList(list) {
    var html = '';
    $.each(list, function (i, v) {
        html += '<div class="index-goods-content" onclick="redirect(\'goodsdetail.html?id='+ v.id +'\')"><img onerror="this.src=\'images/none-image.png\'" src="' +  imgurl + v.mainPhotoPath + '" ><h1>' + v.goods_name + '</h1><h2>￥' + formatPrice(v.goods_current_price) + '</h2></div>';
    });
    return html;
}

$(window).scroll(function () {
    if (totalPage <= pageNumber) {
        return false;
    }
    if (isLoding) {
        return false;
    }
    if (gc_num != 0) {
        return false;
    }
    var wScrollY = window.scrollY;
    if (wScrollY >= listHeight - bodyHeight - 20) {
        pageNumber++;
        isLoding = true;
        requestGoodsData(gc_id, pageNumber);
    }
});

/**
 * 微信扫一扫
 * @return {boolean}
 */
function functionScan() {
    if (!isWeiXin()) {
        return false;
    }
    requestData("js_scan_init.htm", {}, function(config_data) {
        if (config_data.success == true){
            config_data = config_data.data;
        }else{
            show_alert("扫一扫调取失败");
            return false;
        }
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: config_data.appId, // 必填，公众号的唯一标识
            timestamp: config_data.timestamp, // 必填，生成签名的时间戳
            nonceStr: config_data.nonceStr, // 必填，生成签名的随机串
            signature: config_data.signature,// 必填，签名，见附录1
            jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        //点击扫描按钮，扫描二维码并返回结果
        wx.ready(function(){
            wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function (res) {
                    window.location.href = res.resultStr;
                }
            });
        });
        wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
    });
}
