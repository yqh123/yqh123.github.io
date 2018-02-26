/**
 * 浏览器信息
 */
function browers() {
    var ua = navigator.userAgent.toLowerCase(),
        rwebkit = /(webkit)[ \/]([\w.]+)/,
        ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        rmsie = /(msie) ([\w.]+)/,
        rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
        match = rwebkit.exec(ua) ||
            ropera.exec(ua) ||
            rmsie.exec(ua) ||
            ua.indexOf('compatible') < 0 && rmozilla.exec(ua) ||
            [];


    // 通过userAgent获取中间的键值对，其中值支持小数点，如v=1.2.2
    var extraMs, extra = {};
    if ((extraMs = /<<([a-z0-9]+\=\w*(?:&[a-z0-9]+\=[\w\.]*)*)>>/.exec(ua.replace('$s=', '&s=')))) {
        var arr = extraMs[1].split('&')
        for (var i in arr) {
            var ar = arr[i].split('=');
            extra[ar[0]] = ar[1];
        }
    }
    var isApp = Object.keys(extra).length;
    var usa = navigator.userAgent;
    return {
        type: match[1] || '',
        version: match[2] || '0',
        mobile: /(MIDP|WAP|UP\.Browser|Smartphone|Obigo|AU\.Browser|wxd\.Mms|WxdB\.Browser|CLDC|UP\.Link|KM\.Browser|UCWEB|UCBrowser|SEMC\-Browser|Mini|Symbian|Palm|Nokia|Panasonic|MOT|SonyEricsson|NEC|Alcatel|Ericsson|BENQ|BenQ|Amoisonic|Amoi|Capitel|PHILIPS|SAMSUNG|Lenovo|Mitsu|Motorola|SHARP|WAPPER|LG|EG900|CECT|Compal|kejian|Bird|BIRD|G900\/V1\.0|Arima|CTL|TDG|Daxian|DAXIAN|DBTEL|Eastcom|EASTCOM|PANTECH|Dopod|Haier|HAIER|KONKA|KEJIAN|LENOVO|Soutec|SOUTEC|SAGEM|SEC|SED|EMOL|INNO55|ZTE|iPhone|Android|Windows CE|BlackBerry|MicroMessenger)/i.test(navigator.userAgent),
        android: ua.indexOf('android') > -1,
        ios: /(ipad|ios|iphone)/.test(ua),
        weixin: usa.indexOf('MicroMessenger') > -1,
        qq: usa.indexOf('MQQBrowser') > -1 || usa.indexOf('QQ/') > -1,
        userAgent: usa,
        extra: extra,
        isApp: isApp
    };
}

window.MOZ = browers()