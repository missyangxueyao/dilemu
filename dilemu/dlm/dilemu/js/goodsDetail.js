/**
 * Created by ZhuXueSong on 2017/6/21.
 */
var param = get_param();

var isSpecifications = "";          //是否有规格
var isSpecificationsIds = [];       //规格id
var SpecificationsId = false;
var goods_inventory = 0;            //库存
var goodsBuyNum = 1;                //购买数量
var goodsPrice = 0.00;              //商品价格
var buyType = 1;                    //购买方式 1普通，2团购，3特价，4组合
var rebate = 1;                     //折扣
var thisPrice;                      //当前所取的价格
var groupId = 0;                    //组合商品id
var assessIsLoading = false;        //是否已加载过评论
var assessShow = false;
var flash;
var meal_price = 0;                 //套餐价格


function bannerswiper() {
    var mySwiper = new Swiper('#goodsdetail-container', {
        direction: 'horizontal',
        loop: true,
        pagination: '.swiper-pagination',//分页显示设置
        autoplay: 6000,
        width: window.innerWidth,
        nested: true
    });
}
function checkbox() {
    $(".checkbox_label i").click(function () {
        var obj = $(this);
        if (!obj.siblings("input").attr("checked")) {
            obj.addClass("checked");
            groupId = obj.attr("data-group");
            $("#goodsPriceSpan").html("￥" + meal_price);
        } else {
            obj.removeClass("checked");
            groupId = 0;
            $("#goodsPriceSpan").html("￥" + goodsPrice);
        }
    });
}
function smallbanner() {
    //    相似产品滑动
    var mySwiper = new Swiper('.swiper-youer', {
        slidesPerView: 'auto',
        spaceBetween: 0,
    })
}
function getWidth() {
    var htmlSize = parseFloat($('html').css("font-size"));
    var obj = $(".package-imgslide");
    var width = 0;
    $(".package-imgslide ul").each(function () {
        width += parseFloat($(this).css("width")) + htmlSize * 0.62;
    });
    obj.css("width", width + "px");
}

requestData("goods.htm", {id: param.id}, function (data) {
    if (data.success == true) {
        var result = data.data;
        var banner = '';
        for (var i in result.img_list) {
            banner += '<div class="swiper-slide top-banner"><img src="' + imgurl + result.img_list[i].path + '" alt="" onerror="this.src=\'images/none-image.png\'">' + (result.img_list[i].type ? '<i onclick="playVideo(\'' + imgurl + result.img_list[i].attach + '\')"></i>' : '') + '</div>'
        }
        if (result.img_list[0]) {
            $(".norms-goods img").attr({
                "src": imgurl + result.img_list[0].path,
                "onerror": "this.src = 'images/none-image.png'"
            });
        } else {
            $(".norms-goods img").attr("src", "images/none-image.png");
            banner = '<div class="swiper-slide top-banner"><img src="images/none-image.png" alt="" onerror="this.src=\'images/none-image.png\'"></div>';
        }
        $("#goodsdetail-container .swiper-wrapper").append(banner);
        bannerswiper();
        //goodsPrice = formatPrice(result.goods_current_price);
        if (result.rebate) {
            rebate = result.rebate;
        }
        if (result.special_status) {
            buyType = 3;
            thisPrice = result.goods_price;
        } else if (result.group_status) {
            buyType = 2;
            thisPrice = result.goods_price;
        } else {
            thisPrice = result.goods_current_price
        }
        flash = result.flash;
        setBuyButton(thisPrice, rebate, buyType, flash);
        goodsPrice = formatPrice(thisPrice * rebate);
        if (result.special_status && result.endTime) {
            var time = new Date();
            var endTime = new Date(result.endTime.replace(/\-/g, "/")) - time;
            var starTime = time - new Date(result.beginTime.replace(/\-/g, "/"));
            if (endTime > 1000 && starTime >= 0) {
                var endTime1 = getEndTime(endTime);
                var goodsText = '<h1>' + result.goods_name + '</h1><div class="special">￥' + goodsPrice + '<h5><em style="width: ' + result.percent + ';"></em><span>剩余 ' + result.percent + '</span></h5><h4>距离结束剩：<em id="endTime_6" data-time="' + endTime + '">' + endTime1 + '</em></h4></div><span>' + result.summary + '</span>';
            } else {
                var goodsText = '<h1>' + result.goods_name + '</h1><div>￥' + goodsPrice + '</div><span>' + result.summary + '</span>';
            }
            // var endTime1 = getEndTime(endTime);
            // var goodsText = '<h1>' + result.goods_name + '</h1><div class="special">￥' + goodsPrice + '<h5><em style="width: ' + result.percent + ';"></em><span>剩余 ' + result.percent + '</span></h5><h4>距离结束剩：<em id="endTime_6" data-time="' + endTime + '">' + endTime1 + '</em></h4></div><span>' + result.summary + '</span>';
        } else {
            var goodsText = '<h1>' + result.goods_name + '</h1><div>￥' + goodsPrice + '</div><span>' + result.summary + '</span>';
        }
        $(".text-detail").html(goodsText);
        setLimitTime(result.special_status);
        $(".norms-goodsText").html('<h1>' + result.goods_name + '</h1><span id="goodsPriceSpan">￥' + goodsPrice + '</span>');
        goods_inventory = result.goods_inventory;
        $(".norms-numText em").html(goods_inventory);
        if (goods_inventory <= 0) {
            setNoBuy(false);
        }
        /*产品套餐*/
        if (result.apiCombin.apiCombinGoods.length > 0) {
            meal_price = formatPrice(result.apiCombin.price);
            var Combingoods = '<p>￥' + meal_price + ' <span> &nbsp;省￥' + formatPrice(result.apiCombin.price_count - result.apiCombin.price) + '</span></p>' +
                '<label class="checkbox_label"><i class="check" data-group="' + result.apiCombin.goods_id + '"></i> <input type="checkbox" value="1" name="agree" class="hidden"></label>';
            $(".package-title").append(Combingoods);
            checkbox();
        } else {
            $(".ProductPackage").remove();
        }
        var apiCombinGoods = result.apiCombin.apiCombinGoods
        for (i in apiCombinGoods) {
            var combingoodsList = '<ul>' +
                '<li><img src="' + imgurl + apiCombinGoods[i].mainPhotoPath + '"></li><li>' + apiCombinGoods[i].goods_name + '</li><li>￥' + apiCombinGoods[i].goods_price + '</li>' +
                '</ul>' +
                '<span></span>'
            $(".package-imgslide").append(combingoodsList)
        }
        $(".package-imgslide").find('span').eq(apiCombinGoods.length - 1).css('display', 'none')
        getWidth();
        /*相似产品*/
        if (result.goods_list.length > 0) {
            var samegoods = '';
            for (var s in result.goods_list) {
                samegoods += '<div class="swiper-slide swiper-goods">' +
                    '<a href="goodsdetail.html?id=' + result.goods_list[s].id + '">' +
                    '<img src="' + imgurl + result.goods_list[s].mainPhotoPath + '" onerror="this.src=\'images/none-image.png \'">' +
                    '<h1>' + result.goods_list[s].goods_name + '</h1>' +
                    '<p>￥' + formatPrice(result.goods_list[s].goods_current_price) + '</p>' +
                    '</a>' +
                    '</div>'
            }
            $(".swiper-youer .swiper-wrapper").append(samegoods);
            smallbanner();
        } else {
            $(".sameProduct").remove();
        }

        /* 收藏按钮 */
        if (result.collect) {
            $("li.collect").attr({"data-collectid": result.collectId, "data-type": result.collect});
            if (result.collect == 1){
                $("li.collect").addClass("collect-success");
            }
        }
        /* 产品详情 */
        $(".detail-content").html(result.goods_details);

        /*购物车选规格*/
        setSpecifications(result.lsSpecifications);


    } else {
        if (document.referrer.replace("WeChatLogin.html", "") !== document.referrer) {
            show_alert(data.msg, "", "index.html", true);
        } else {
            show_alert_back(data.msg);
        }
    }
}, true);

//    详情与评论
$(".detailComment-nav").find("li").click(function () {
    $(".tabContent").css("display", "none");
    var num = $(this).index() + 1;
    var nums = $(this).siblings().index() + 1;
    var red = 'red' + num;
    var reds = 'red' + nums;
    var moren = 'moren' + num;
    var morens = 'moren' + nums;
    $(this).addClass(red).removeClass(moren);
    $(this).siblings().addClass(morens).removeClass(reds);
    $(".tabContent").eq($(this).index()).css("display", "block");
    if ($(this).index() == 1 && assessIsLoading == false) {
        loadGoodsAssessList();
    }
    if ($(this).index() == 1) {
        assessShow = true;
    } else {
        assessShow = false;
    }
});
// 选规格(暂时点击footer的加入购物车和立即购买按钮生效)
$(".gobuy,.addcar").click(function () {
    $(".mc").css('display', 'block');
    $(".norms").css('display', 'block');
});

$('.add').click(function () {
    if (goodsBuyNum >= goods_inventory) {
        show_alert("库存不足");
        return false;
    }
    $('#num').val(++goodsBuyNum);
});
$('.sign').click(function () {
    if ($('#num').val() > 1) {
        $('#num').val(--goodsBuyNum);
    } else {
        show_alert("购买数量不能小于1");
    }
});
$(".close").click(function () {
    $(".mc").css('display', 'none')
    $(".norms").css('display', 'none')
});

/**
 * 设置商品规格
 * @param list
 */
function setSpecifications(list) {
    var obj = $(".norms-color");
    obj.html("");
    if (list.length <= 0) {
        isSpecifications = 0;
        return false;
    } else {
        isSpecifications = 1;
    }
    var html = '';
    $.each(list, function (i, v) {
        html += '<div class="norms-colorText">' + v.name + ': </div> <div class="norms-colorList"> <ul>';
        $.each(v.properties, function (j, val) {
            html += '<li onclick="selectThisSpec(this, ' + val.id + ', ' + i + ');">' + val.value + '</li>';
        });
        html += '</ul></div></div>';
        isSpecificationsIds[i] = 0;
    });
    obj.html(html);
}

/**
 * 选择规格
 * @param obj
 * @param id
 * @param i
 */
function selectThisSpec(obj, id, i) {
    obj = $(obj);
    if (obj.hasClass("checked")) {
        return false;
    }
    obj.addClass("checked").siblings("li").removeClass("checked");
    isSpecificationsIds[i] = id;
    SpecificationsId = arrayToString(isSpecificationsIds, ",");
    if (SpecificationsId !== false) {
        getPriceAsSpec(param.id, SpecificationsId);
    }
}

/**
 * 根据规格获取商品价格和库存
 * @param id
 * @param gsp
 */
function getPriceAsSpec(id, gsp) {
    requestData("load_goods_gsp.htm", {id: id, gsp: gsp}, function (data) {
        if (!data.success) {
            show_alert(data.msg);
            return false;
        }
        setBuyButton(data.data.price, rebate, buyType, flash);
        thisPrice = formatPrice(data.data.price);
        goodsPrice = formatPrice(data.data.price * rebate);
        goods_inventory = data.data.count;
        $(".norms-numText em").html(goods_inventory);
        if (goods_inventory <= 0) {
            setNoBuy(false);
        } else {
            setNoBuy(true);
        }
        if (groupId) {
            $("#goodsPriceSpan").html("￥" + meal_price);
        } else {
            $("#goodsPriceSpan").html("￥" + goodsPrice);
        }
    });
}

/**
 * 我也不知道该怎么说，反正很好用，选择规格时使用
 * @param array
 * @param point
 * @return {string|boolean}
 */
function arrayToString(array, point) {
    var string = "";
    var all = true;
    $.each(array, function (i, v) {
        if (!v) {
            all = false;
        }
        if (string == "") {
            string += v;
        } else {
            string += point + v;
        }
    });
    return all ? string : false;
}

/**
 * 加入购物车或立即购买
 * @param buy_type
 * @param obj
 * @return boolean
 */
function addCartNow(buy_type, obj) {
    if ($(obj).hasClass("no-click")) {
        return false;
    }
    if (!checkLogin(false)) {
        return false;
    }
    if (buy_type == "buy" && !isWeiXin()) {
        return false;
    }
    if (isSpecifications && !SpecificationsId) {
        show_alert("请选择规格");
        return false;
    }
    var act_type = "";
    if (groupId) {
        buyType = 4;
        goodsPrice = meal_price;
    }
    switch (buyType) {
        case 2:
            act_type = buy_type ? "hsGroup" : "";
            break;
        case 3:
            act_type = "special";
            break;
        case 4:
            act_type = "combin";
            break;
        default:
            act_type = "";
            break;
    }
    var postData = {
        id: groupId ? groupId : param.id,
        price: buy_type ? goodsPrice : (buyType == 2 ? thisPrice : goodsPrice),
        count: goodsBuyNum,
        gsp: SpecificationsId,
        buy_type: buy_type,
        act_type: act_type
    };
    requestData("add_goods_cart.htm", postData, function (data) {
        if (!data.success) {
            show_alert(data.msg);
            return false;
        }
        if (buy_type) {
            redirect("jiesuan.html?carId=" + data.data.gc_ids);
        } else {
            show_alert("加入购物车成功");
            $(".mc").hide();
        }
    });
}

function setBuyButton(_price, _rebate, _type, flash) {
    if (_rebate == 1 || _type != 2) {
        return false;
    }
    $(".norms-gobuy,.gobuy").addClass("price").html('<h1>￥' + formatPrice(_price * _rebate) + '</h1>' + (flash ? "去参团": "去开团"));
    $(".norms-addcar,.addcar").addClass("price").html('<h1>￥' + formatPrice(_price) + '</h1>加入购物车');
}

/**
 * 根据毫秒数计算剩余时间  H:i:s
 * @param time
 * @return {string}
 */
function getEndTime(time) {
    time = parseInt(time / 1000);
    return formatTime(parseInt(time/3600)) + ":" + formatTime(parseInt((time%3600)/60)) + ":" + formatTime(time%60);
}

/**
 * 时间格式化
 * @param time
 * @return {string}
 */
function formatTime(time) {
    return time > 9 ? time : "0" + time;
}

/**
 * 倒计时
 * @param status
 * @return {boolean}
 */
function setLimitTime(status) {
    if (!status) {
        return false;
    }
    var map1 = setInterval(function () {
        var obj = $("#endTime_6");
        var e_time = parseInt(obj.attr("data-time"));
        e_time -= 1000;
        obj.html(getEndTime(e_time)).attr("data-time", e_time);;
        if (e_time <= 0) {
            clearInterval(map1);
            history.go(0);
        }
    }, 1000);
}

/**
 * 收藏、取消收藏
 * @param obj
 * @return {boolean}
 */
function collectThisGoods(obj) {
    obj = $(obj);
    var collectType = parseInt(obj.attr("data-type"));
    if (collectType == -1) {
        show_alert("请登录", "", "login.html", false);
        return false;
    }
    if (collectType == 0) {     //收藏
        requestData("add_goods_favorite.htm", {id: param.id}, function (data) {
            if (!data.success) {
                show_alert(data.msg);
                return false;
            }
            show_alert("收藏成功");
            obj.addClass("collect-success").attr({"data-type": 1, "data-collectid": data.data});
        });
    } else {       //取消收藏
        var collect_id = parseInt(obj.attr("data-collectid"));
        requestData("favorite_del.htm", {"mulitId": collect_id}, function (data) {
            if (!data.success) {
                show_alert(data.msg);
                return false;
            }
            show_alert("取消收藏");
            obj.removeClass("collect-success").attr({"data-type": 0, "data-collectid": 0});
        })
    }
}



/**************************************************** ******************************************************/
/**************************************************** ******************************************************/
/****************************************** 以下是商品评论列表部分js ******************************************/


var pageNumber = 1;
var totalPage = 1;
var bodyHeight = document.body.clientHeight;
var listHeight = 0;
var isLoding = false;

/**
 * 加载评论列表
 */
function loadGoodsAssessList() {
    assessIsLoading = true;
    requestData('goods_evaluation.htm', {goods_id: param.id, currentPage: pageNumber}, function (data) {
        if (!data.success) {
            show_alert(data.msg);
            return false;
        }
        data = data.data;
        $("#avg").html(data.avg ? data.avg.toFixed(1) : "0.0");
        totalPage = data.data.totalPage;
        $(".star-red-box").css("width", parseFloat(data.avg)/5*100 + "%");
        getAssessHtml(data.data.recordList);
    })
}

function getAssessHtml(data) {
    var html = '';
    $.each(data, function (i, v) {
        html += '<div class="comment-comment">'+
            '<div class="comment-commentTitle">'+
            '<img src="' + imgurl + v.evaluate_user.avatarUrl + '" onerror="this.src=\'images/orders/group-head1@2x.png\'" alt="">'+
            '<span class="comment-user">' + v.evaluate_user.nickname + '</span>'+
            '<span class="comment-time">' + get_date(v.addTime) + '</span></div>'+
            '<div class="comment-commentText">'+ v.evaluate_info + '</div>'+
            '<div class="comment-commentImg">'+ splitImages(v.evaluate_pics) + '</div>'+
            '</div>';
    });
    $(".comment-content").append(html);
    listHeight = document.getElementById("load_more").offsetTop;
    isLoding = false;
}


$(window).scroll(function () {
    if (assessShow == false) {
        return false;
    }
    if (totalPage <= pageNumber) {
        return false;
    }
    if (isLoding) {
        return false;
    }
    var wScrollY = window.scrollY;
    if (wScrollY >= listHeight - bodyHeight - 20) {
        pageNumber++;
        isLoding = true;
        loadGoodsAssessList();
    }
});

/**
 * 拼接图片地址
 * @param images
 * @return {string}
 */
function splitImages(images) {
    if (images == "") {
        return "";
    }
    if (images.replace(",", "") == images) {
        return '<img src="' + imgurl + images + '" onclick="showBigImageShow(this.src);" onerror="this.src=\'images/none-image.png\'"/>';
    }
    images = images.split(",");
    var str = '';
    $.each(images, function (i, v) {
        str += '<img src="' + imgurl + v + '" onclick="showBigImageShow(this.src);" onerror="this.src=\'images/none-image.png\'"/>';
    });
    return str;
}

/**
 * 播放视频
 * @param videoUrl
 */
function playVideo(videoUrl) {
    $("#video").attr("src", videoUrl);
    $(".goodsVideoDialog").show();
}

function hideVideo() {
    $("#video").attr("src", "");
    $(".goodsVideoDialog").hide();
}

function setNoBuy(type) {
    if (!type) {
        $(".norms-gobuy, .norms-addcar").addClass("no-click");
    } else {
        $(".norms-gobuy, .norms-addcar").removeClass("no-click");
    }
}