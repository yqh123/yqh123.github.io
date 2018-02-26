/*jQuery/Zepto弹窗插件 | version:2016-11-30*/
!function (t) {
    t._ismob = /i(Phone|Pod)|Android|phone/i.test(navigator.userAgent), t._isalert = t._isload = 0, t.alert = function () {
        if (arguments.length) return t._isalert = 1, t.confirm.apply(t, arguments)
    }, t.confirm = function () {
        var e, o = arguments;
        if (o.length) {
            var a = o[1], n = function (t) {
                "function" == typeof a ? 0 != a.call(e, t.data.r) && e.close() : e.close()
            };
            e = t('<div class="alert_overlay ' + (t._ismob ? "mob" : "pc") + '"><div class="alert_msg"><div class="alert_content">' + o[0] + '</div><div class="alert_buttons"><button class="alert_btn alert_btn_cancel">取消</button><button class="alert_btn alert_btn_ok">确定</button></div></div><div class="alert-closed"></div>').on("contextmenu", !1).on("click", ".alert_btn_ok", {r: !0}, n).on("click", ".alert_btn_cancel,.alert-closed", {r: !1}, n), t._isload ? e.find(".alert_content").css("text-align", "center").parent().css({
                width: "auto",
                borderRadius: "4px"
            }).find(".alert_buttons").remove() : t._isalert && e.find(".alert_btn_cancel").remove(), e.appendTo("body").find(".alert_btn_ok").focus(), e.ok = function (t) {
                return e.find(".alert_btn_ok").text(t || "确定"), e
            }, e.cancel = function (t) {
                return e.find(".alert_btn_cancel").text(t || "取消"), e
            }, e.content = function (t) {
                return t && e.find(".alert_content").html(t), e
            }, e.close = function () {
                e.one("webkitTransitionEnd transitionEnd", function () {
                    e.remove()
                }).removeClass("alert_show")
            }, e.addClass("alert_show")
        }
        return t._isalert = t._isload = 0, e
    }, t.tips = function (e, o) {
        if (e) if (t._ismob) t(".alert_tips").remove(), t('<div class="alert_tips mob"><div>' + e + "</div></div>").appendTo("body").one("webkitAnimationEnd animationEnd", function () {
            t(this).remove()
        }); else {
            var a = t(".alert_tips");
            a.length || (a = t('<div class="alert_tips pc"></div>').appendTo("body")), t("<div>" + e + "</div>").appendTo(a).fadeIn("fast").delay(o || 2e3).slideUp("fast", function () {
                t(this).remove()
            })
        }
    }, t.load = function () {
        t(".alert_overlay").remove(), t._isload = 1;
        var e = t.confirm.call(t, arguments[0] || "loading...");
        return t.loaded = e.close, e
    }
}($);