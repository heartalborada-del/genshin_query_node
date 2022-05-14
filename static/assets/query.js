function check_mys(mys) {
    var pattern1 = /^[0-9]*$/g
    if (!pattern1.test(mys)) {
        return false
    }
    return true
}
function swco(coid,bt) {
    co01.toggle(coid)
    console.log(bt.nextSbiling())
}
function q_gi() {
    var mys = $('#mys').val()
    if (check_mys(mys)) {
        $.get("./api/cn/roleInfo?uid=" + mys, function (data, status) {
            if ("code" in data) {
                if (data.code != 0) {
                    mdui.alert('', '登录错误,错误原因' + data.msg);
                    return
                }
            }
            ht = ''
            for (var key in data) {
                ht = ht + "<tr><td>" + key + "</td><td>" + data[key] + "</td></tr>"
            }
            $('#gi_t').html(ht)
            mdui.updateTables('#gi_t')
        })
    }
}

function q_ri() {
    var uid = $('#uid01').val()
    var sr = $('#sc01').val()
    if (check_mys(uid)) {
        $.get("./api/cn/getuserinfo?uid=" + uid + "&region=" + sr, function (data, status) {
            if ("code" in data) {
                if (data.code != 0) {
                    mdui.alert('', '登录错误,错误原因' + data.msg,{
                        history: false,
                        destroyOnClosed: true
                    });
                    return
                }
            }
            console.log(data)
        })
    }
}