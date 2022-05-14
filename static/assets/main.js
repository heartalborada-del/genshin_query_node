$('#logout').click(function () {
    $.ajax({
        type: 'post',
        url: './api/cn/logout',
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function (data) {
            console.log(data)
        }
    })
})

$('#login_tab').click(function () {
    $.pjax({
        url: '/pages/login.html'
    })
    setCookie('page', 'login')
})

$('#query_tab').click(function () {
    $.pjax({
        url: '/pages/query.html'
    })
    setCookie('page', 'query')
})

$('#my_tab').click(function () {
    $.pjax({
        url: '/pages/my.html'
    })
    setCookie('page', 'my')
})

$('#about_tab').click(function () {
    $.pjax({
        url: '/pages/about.html'
    })
    setCookie('page', 'about')
})


function setCookie(name, value) {
    var daysToLive = 30
    var cookie = name + "=" + encodeURIComponent(value);
    if (typeof daysToLive === "number") {
        cookie += "; max-age=" + (daysToLive * 24 * 60 * 60);
    }
    document.cookie = cookie;
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}
if (getCookie('page') == null) {
    setCookie('page', 'login')
}
$.pjax.defaults.timeout = 0
$.pjax.defaults.container = '#show'
$.pjax.defaults.push = false
$.pjax.defaults.replace = false

$.pjax({
    url: '/pages/' + getCookie('page') + '.html',
    container: '#show',
    push: false,
    replace: false
})
new mdui.Tab('#tab').show(getCookie('page') + '_tab')

var co01 = new mdui.Collapse('#collapse');

$(document).on('pjax:start', function () { NProgress.start(); });
$(document).on('pjax:end', function () { NProgress.done(); });