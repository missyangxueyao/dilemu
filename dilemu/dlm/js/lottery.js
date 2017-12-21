/**
 * Created by ZhuXueSong on 2017/5/26.
 */
var turnplate = {
    restaraunts: [],				//大转盘奖品名称
    colors: [],					    //大转盘奖品区块对应背景颜色
    outsideRadius: 192,			    //大转盘外圆的半径
    textRadius: 155,				//大转盘奖品位置距离圆心的距离
    insideRadius: 38,			    //大转盘内圆的半径
    startAngle: 0,				    //开始角度
    bRotate: false, 			    //false:停止;ture:旋转
    images: [],                     //大转盘奖品图片
    ids: []                         //奖品id
};

$(document).ready(function () {
    if (!checkLogin(false)) {
        return false;
    }
    /***************** 动态获取抽奖记录 ******************/
    getLuckyUser();
    setInterval(function () {
        getLuckyUser()
    }, 2000);


    /**************** 获取抽奖奖品 ****************/
    requestData("draw.htm", {}, function (data) {
        if (data.success != true) {
            show_alert_back(data.msg);
            return false;
        }
        data = data.data;
        $(".draw_times").html(data.limit);
        $("#draw_times").html(data.count);
        $(".draw_score").html(data.score);
        var gift = data.apiDrawGifts;
        var len = 0;
        var images = "";
        for (var i = 1; i < gift.length; i++) {
            turnplate.restaraunts[len] = gift[0].gift;
            turnplate.restaraunts[len+1] = gift[i].gift;
            turnplate.images[len] = "";
            turnplate.images[len+1] = gift[i].image;
            turnplate.ids[len] = gift[0].id;
            turnplate.ids[len+1] = gift[i].id;
            images += gift[i].image ? '<img src="' + config.imageUrl + gift[i].image + '" style="display: none;" onerror="this.src=\'images/none-image.png\'" id="_image_' + (len + 1) + '"/>' : '';
            len += 2;
        }
        $("#lottery_img").html(images);
    }, false);
    //动态添加大转盘的奖品与奖品区域背景颜色
    turnplate.colors = ["#FDBD2D", "#FEEEC0", "#FDBD2D", "#FEEEC0", "#FDBD2D", "#FEEEC0", "#FDBD2D", "#FEEEC0", "#FDBD2D", "#FEEEC0", "#FDBD2D", "#FEEEC0"];


    var rotateTimeOut = function () {
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: 2160,
            duration: 8000,
            callback: function () {
                show_alert('网络超时，请检查您的网络设置！');
            }
        });
    };

    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function (item, txt) {
        var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length * 2));
        if (angles < 270) {
            angles = 270 - angles;
        } else {
            angles = 360 - angles + 270;
        }
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: angles + 1800,
            duration: 8000,
            callback: function () {
                if (txt == turnplate.restaraunts[0]) {
                    showMessage(false);
                } else {
                    showMessage(true, txt);
                }
                turnplate.bRotate = !turnplate.bRotate;
            }
        });
    };

    $('.pointer').click(function () {
        if (turnplate.bRotate)return;
        turnplate.bRotate = !turnplate.bRotate;
        //获取随机数(奖品个数范围内)
        var rand;
        var result = true;
        requestData("drawGift.htm", {}, function (data) {
            if (!data.success) {
                show_alert(data.msg);
                result = false;
                return false;
            }
            rand = getItemNum(data.data.id);
            $("#draw_times").html(parseInt($("#draw_times").html()) - 1);
        }, false);
        if (!result) {
            turnplate.bRotate = false;
            return false;
        }
        var item = rand;
        //var item = rnd(rand, turnplate.restaraunts.length);
        //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
        rotateFn(item + 1, turnplate.restaraunts[item]);
    });
});

function rnd(n, m) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;

}


//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload = function () {
    drawRouletteWheel();
};

function drawRouletteWheel() {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length / 2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 422, 422);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFBE04";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '16px Microsoft YaHei';
        for (var i = 0; i < turnplate.restaraunts.length; i++) {
            var angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.colors[i];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();

            //----绘制奖品开始----
            ctx.fillStyle = "rgb(195,0,32)";
            var text = turnplate.restaraunts[i];
            var line_height = 24;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            //添加对应图标=
            if (text != turnplate.restaraunts[0] && $("#_image_" + i).attr("src")) {
                wrightImage(ctx, "_image_" + i);
            }

            ctx.font = 'bold 20px Microsoft YaHei';
            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
            if (text == turnplate.restaraunts[0]) {
                ctx.font = 'bold 24px Microsoft YaHei';
                line_height = 30;
                text = text.substring(0, 2) + "||" + text.substring(2);
                var texts = text.split("||");
                for (var j = 0; j < texts.length; j++) {
                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                }
            } else if (!turnplate.images[i]) {
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            } else {
                ctx.fillText(text, -ctx.measureText(text).width / 2, 35);
            }
            //把当前画布返回（调整）到上一个save()状态之前
            ctx.restore();
            //----绘制奖品结束----
        }
    }
}

function wrightImage(ctx, imgId) {
    var img = document.getElementById(imgId);
    img.onload = function () {
        ctx.drawImage(img, -35, -56, 70, 70);
    };
    ctx.drawImage(img, -35, -56, 70, 70);
}

function hideShowMessage(obj) {
    $(obj).parents(".dialog").hide();
}

function showMessage(result, txt) {
    if (result) {
        var obj = $(".dialog.lottery_lucky");
        $("#lottery_goods").html(txt);
        obj.show();
    } else {
        $(".dialog.lottery_none").show();
    }
}

function getItemNum(id) {
    var num = 0;
    var noneGift = [];
    var j = 0;
    $.each(turnplate.ids, function (i, v) {
        if (v == turnplate.ids[0]) {
            noneGift[j] = i;
            j++;
        } else if (v == id) {
            num = i;
        }
    });
    if (num == 0) {
        var rand = parseInt(Math.random() * noneGift.length);
        num = noneGift[rand];
    }
    return num;
}

function signUserName(name) {
    if (name == "") {
        return "";
    }
    var length = name.length;
    if (length > 3) {
        name = "***" + name.substr(length - 4, 3);
    }
    return name;
}

function getLuckyUser() {
    if (turnplate.bRotate) {
        return false;
    }
    $.ajax({
        url: config.host + "drawLog.htm",
        type: "POST",
        dataType: "JSON",
        success: function (data) {
            if (!data.success) {
                show_alert("获取抽奖记录失败");
                return false;
            }
            var html = '';
            $.each(data.data, function (i, v) {
                if (i < 5) {
                    html += '<tr><td>' + signUserName(v.user_name) + '</td><td>' + v.gift + '</td><td>' + v.addTime.substr(0, 10) + '</td></tr>';
                }
            });
            $("#lucky_user table").html(html);
        }
    });
}