var co01 = new mdui.Collapse('#co01');
function check_mys(mys) {
    var pattern1 = /^[0-9]*$/g
    if (!pattern1.test(mys)) {
        return false
    }
    return true
}

function swco(coid,bt) {
    co01.toggle(coid)
    if($(bt).hasClass('item-open')){
        $(bt).removeClass('item-open')
    } else {
        $(bt).addClass('item-open')
    }
}

function q_gi(bt) {
    var mys = $(bt).prevAll('div').children('input').val()
    if (check_mys(mys)) {
        $.get("./api/cn/roleInfo?uid=" + mys, function (data, status) {
            if ("code" in data) {
                if (data.code != 0) {
                    mdui.alert('', '查询错误,错误原因-' + data.msg);
                    return
                }
            }
            ht = ''
            for (var key in data) {
                ht = ht + "<tr><td>" + key + "</td><td>" + data[key] + "</td></tr>"
            }
            $(bt).nextAll('.mdui-table-fluid').children('.mdui-table').html(ht)
            mdui.updateTables($(bt).nextAll('.mdui-table-fluid').children('.mdui-table'))
        })
    }
}

function q_ri(bt) {
    var uid = $(bt).prevAll('div').find('input').val()
    var sr = $(bt).prevAll('div').find('select').val()
    if (check_mys(uid)) {
        $.get("./api/cn/getuserinfo?uid=" + uid + "&region=" + sr, function (data, status) {
            if ("code" in data) {
                if (data.code != 0) {
                    mdui.alert('', '查询错误,错误原因-' + data.msg);
                }
            }
            showPlayer($(bt).parent().find('#su').find('.card'),data)
        })
    }
}

function showPlayer(div,data){
    console.log(div)
    console.log(data)
}