var co01 = new mdui.Collapse('#co01');
function check_mys(mys) {
    var pattern1 = /^[0-9]*$/g
    if (!pattern1.test(mys)) {
        return false
    }
    return true
}

function swco(coid, bt) {
    co01.toggle(coid)
    if ($(bt).hasClass('item-open')) {
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
            showPlayer($(bt).parent().find('#su').find('#summary'), data)
            showWorld($(bt).parent().find('#su').find('#world'), data)
        })
    }
}

function showPlayer(div, data) {
    $.get("./assets/i18n/zh-cn.json", function (i18n, status) {
        var a = "";
        for (key in data.summary) {
            a = a + '<div class="modify-info-card summary-card"><div class="value">' + data.summary[key] + '</div><div class="desc">' + i18n.summary[key] + '</div></div>'
        }
        div.html(a)
    })
}

function showWorld(div, data) {
    var a = "";
    for (key in data.worldExploration) {
        a = a + '\
        <div class="modify-info-card world"><div class="card"><div class="border"></div>\
        <img class="icon" src="'+ data.worldExploration[key].icon + '"><img class="bg" src="'+ data.worldExploration[key].background_image + '">\
        <div class="guide"><p class="name">'+ data.worldExploration[key].world + '</p>\
        <div class="progress-block"><div class="name"><img class="warp"><span>'+ data.worldExploration[key].world + ' 探索度: ' + data.worldExploration[key].exp + '%</span>\
        </div><div class="progress"><div class="val" style="width:'+ data.worldExploration[key].exp + '%"></div></div></div>'
        if(JSON.stringify(data.worldExploration[key].offering) != '{}'){
            a = a + '<div class="offering"><img src="'+data.worldExploration[key].offering.icon+'">\
            <span>'+data.worldExploration[key].offering.name+'等级: '+data.worldExploration[key].offering.level+'级</span></div>'
        }
        if (data.worldExploration[key].level != 0){
            a = a + '<div class="offering"><img class="pre"><span>声望等级: '+data.worldExploration[key].level+'级</span></div>'
        }
        a = a + '</div></div></div>'
    }
    div.html(a)
}
