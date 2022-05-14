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
        url: '/pages/login.html',
        container: '#show',
        push: false,
        replace: false
    })
})

$('#query_tab').click(function () {
    $.pjax({
        url: '/pages/query.html',
        container: '#show',
        push: false,
        replace: false
    })
})

$('#my_tab').click(function () {
    $.pjax({
        url: '/pages/my.html',
        container: '#show',
        push: false,
        replace: false
    })
})

$('#about_tab').click(function () {
    $.pjax({
        url: '/pages/about.html',
        container: '#show',
        push: false,
        replace: false
    })
})

$.pjax({
    url: '/pages/login.html',
    container: '#show',
    push: false,
    replace: false
})

$(document).on('pjax:start', function () { NProgress.start(); });
$(document).on('pjax:end', function () { NProgress.done(); });