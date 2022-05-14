function check(account, pw) {
    var pattern1 = /^(^1(3|4|5|6|7|8|9)\d{9})|(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$)/g
    var pattern2 = /^.*(?=.{8,15})(?=.*[a-zA-Z])(?=.*[0-9]).*$/
    if ((pw.lenth <= 8 || pw.lenth >= 15) && !pattern2.test(pw)) {
        return false
    }
    if (!pattern1.test(account)) {
        return false
    }
    return true
}

function login(account, pw, mmt_key, challenge, validate) {
    var ep = new JSEncrypt()
    ep.setPublicKey('-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDvekdPMHN3AYhm/vktJT+YJr7\ncI5DcsNKqdsx5DZX0gDuWFuIjzdwButrIYPNmRJ1G8ybDIF7oDW2eEpm5sMbL9zs\n9ExXCdvqrn51qELbqj0XxtMTIpaCHFSI50PfPpTFV9Xt/hmyVwokoOXFlAEgCn+Q\nCgGs52bFoYMtyi+xEQIDAQAB\n-----END PUBLIC KEY-----')
    $.ajax({
        type: 'post',
        url: './api/cn/login',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        dataType: "json",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: {
            account,
            password: ep.encrypt(pw),
            mmt_key,
            challenge,
            validate
        },
        success: function (data) {
            if (data.code != 0) {
                mdui.alert('', '登录错误,错误原因' + data.msg);
                return
            }
            mdui.alert('', '登陆成功');
        }
    })
}

function dologin() {
    var account = $('#account').val()
    var pw = $('#password').val()
    if (check(account, pw)) {
        $.get("./api/cn/getmmt", function (data, status) {
            let [challenge, gt, mmt] = ''
            challenge = data['challenge']
            gt = data['gt']
            mmt = data['mmt_key']
            initGeetest({
                gt: gt,
                challenge: challenge,
                offline: false,
                new_captcha: true,
                product: 'bind',
                width: "300px",
                https: true
            }, function (captchaObj) {
                captchaObj.onReady(function () {
                    captchaObj.verify()
                })
                captchaObj.onSuccess(function () {
                    let [validate, seccode] = ''
                    var result = captchaObj.getValidate();
                    validate = result.geetest_validate
                    seccode = result.geetest_seccode;
                    login(account, pw, mmt, challenge, validate)
                })
            });
        })
    }
}