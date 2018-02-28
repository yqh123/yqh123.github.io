var CUR = "cur";
var config = {
    host: "https://open.jiehun.com.cn",
    host2: "https://open.jiehun.com.cn",
    API: {
        "pageLaud": "/travel/get-page-laud",
        "userLaud": "/travel/get-user-laud",
        "saveLaud": "/travel/put-save-laud",
        "pageRecord": "/travel/get-page-record",
        "userlaudbyuid": "/travel/get-user-laudbyuid",
        "saveRecordbyapp": "/travel/put-save-recordbyapp",
        "saveRecordbyweixin": "/travel/put-save-recordbyweixin"
    },
    API2: {
        "info": "/my/account/get-info",
        "groupbuy": "/my/demand/get-lvpai-group-buying",
        "detail": "/mall/demand/get-detail",
        "wishshare": "/mall/demand/get-lvpai-wish-share",
        "postdemand": "/mall/demand/post-demand",
        "wishlist": "/mall/demand/get-lvpai-wish-list"
    },
    token: "",
    id: {
        wish: 15,
        ping: 16
    },
    get: function (key, params, callback) {
        alert(123)
        var url = this.host + this.API[key];
        params.token = params.token.replace("dmp ", "");
        return $.ajax({
            type: "POST",
            url: url,
            data: params,
            headers: {
                "Authorization": config.token
            },
            success: function (data) {
                if (data.code === 0 || data.code === 1004) {
                    callback(data)
                } else {
                    alert(data.message);
                }
            }
        });
    },
    getHbs: function (key, params, callback) {
        var url = this.host2 + this.API2[key];
        return $.ajax({
            type: "POST",
            url: url,
            data: params,
            headers: {
                "Authorization": config.token
            },
            success: function (data) {
                if (data.code === 0 || data.code === 1004) {
                    callback(data)
                } else {
                    alert(data.message);
                }
            },
            error: function () {
                alert('网络错误');
            }
        })
    },
    getSource: function (source) {
        var from = "未知"
        switch (source) {
            case 1:
                from = "微信";
                break;
            case 2:
                from = "婚博会app";
                break;
            default:
                break;
        }
        return from;
    },
    formatTime: function (timeline) {
        var date = new Date(timeline),
            fmt = "yyyy-MM-dd"
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    //分享积攒
    share: function (ele) {
        var path = "card_share.html";

        config.getHbs("info", {}, function (d) {
            //分享url=====
            var uid = (d.data || {}).uid || 0
            var url = "https://open.weixin.qq.com/connect/oauth2/authorize?response_type=code&scope=snsapi_userinfo&state=STATE&appid=wx496b7f5a2e2158f1&redirect_uri=" + encodeURIComponent("https://bj.jiehun.com.cn/" + path + "?uid=" + uid)

            hapj.get('share').active(ele, {url: url, title: '2018心愿季', content: '2018许愿去旅拍'})
        })
    },
    toApp: function () {
        window.open("ciw://home")
        setTimeout(function () {
            if (confirm("是否跳转到app下载页？")) {
                location.href = "http://www.jiehun.com.cn/mobile/download/"
            }
        }, 2000)
    },
    isLoginIn: function () {
        var user = hapj.cache.get(hapj.conf.get('user.hash')) ? hapj.cache.get(hapj.conf.get('user.hash'))['data'].user : {};
        if (user) {
            // 登录
            return user
        } else {
            config.toLogin()
            return {}
        }
    },
    toLogin: function () {
        if (config.isInApp()) {
            location.href = "ciw://login"
        } else {
            location.href = "https://bj.jiehun.com.cn/m/accounts/login?u=" + encodeURIComponent(location.href)
        }
    },
    getToken: function () {
        var jhu = hapj.page.getCookie('jhu') ? hapj.page.getCookie('jhu') : hapj.page.getCookie('Authorization');
        if (jhu) {
            if(!/^dmp/.test(jhu)){
                jhu = 'dmp ' + jhu;
            }  
            config.token = jhu;
        }
        return config.token
    },
    toIndex: function () {
        if (config.isInApp()) {
            location.href = "card_index.html"
        }
    },
    isInApp: function () {
        //不在app内
        if (!hapj.browser.ciwApp) {
            config.toApp()
            return false
        }
        return true
    }
};

hapj.conf.set('check.login', 1);

config.initSwitch = function () {
    var navs = $(".ping-switch").children(),
        secs = $(".ping-switch-detail").children()
    secs.addClass("hidden")
    $(secs[0]).removeClass("hidden")
    navs.on("click", function () {
        var $this = $(this);
        if ($this.hasClass(CUR)) {
            return false;
        }

        var index = $this.index();
        navs.removeClass(CUR)
        $this.addClass(CUR)
        secs.each(function (i) {
            if (i === index) {
                $(this).removeClass("hidden")
            } else {
                $(this).addClass("hidden")
            }
        })
        return false;
    })
}

config.initSwitchSec = function () {
    $(".ping-select-section").each(function () {
        var navs = $(this).find(".nav-bar").children(),
            secs = $(this).find(".ping-select-content-item");
        secs.addClass("hidden")
        $(secs[0]).removeClass("hidden");

        navs.on("click", function () {
            var $this = $(this);
            if ($this.hasClass(CUR)) {
                return false;
            }

            var left = $this.position().left;
            $(this.parentNode.parentNode).scrollLeft(left);

            var index = $this.index();
            navs.removeClass(CUR)
            $this.addClass(CUR)
            secs.each(function (i) {
                if (i === index) {
                    $(this).removeClass("hidden")
                } else {
                    $(this).addClass("hidden")
                }
            })
            return false;
        })
    })
}


config.getToken()

config.openCard = function () {
    if (!config.isInApp()) {
        return false
    }
    //是否登录
    config.getHbs("info", {}, function (e) {
        if (!e.code) {
            config.toLogin()
        } else {
            //是否有提交成功历史
            config.getHbs("detail", {token: config.token, tpl_id: config.id.wish}, function (d) {
                //不为0，则未提交历史
                if (d.code) {
                    //to 制作业
                    location.href = "card_create.html"
                } else {
                    //to 完成页
                    location.href = "card_mine.html"
                }
            })
        }
    })
}


//倒计时====
function leftTimer() {
    leftTimer.timeshow.each(function () {
        var tList = $(this).attr('data-time').split("-");
        var leftTime = (new Date(tList[0] - 0, tList[1] - 1, tList[2] - 0, tList[3] - 0, tList[4] - 0, tList[5] - 0)) - (new Date()); //计算剩余的毫秒数
        if(leftTime>0){
            var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
            var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
            days = checkTime(days);
            hours = checkTime(hours);
            minutes = checkTime(minutes);
            seconds = checkTime(seconds);
            $(this).html([
                "<span>" + days + "</span>",
                "天",
                "<span>" + hours + "</span>",
                "小时",
                "<span>" + minutes + "</span>",
                "分",
                "<span>" + seconds + "</span>",
                "秒"].join("")
            );
        }
    })
    leftTimer.timer = setTimeout("leftTimer()", 1000);
}

