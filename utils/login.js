const gen = require('./gen')
const http = require('./http')
const pino = require("pino")
const request = require('request')

const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

const login = ({account,password,mmt_key,gc,gv}) => {
    var j = request.jar()
    return new Promise((resolve, reject) =>{
        http({
            method: "POST",
            url: "https://api-takumi.mihoyo.com/account/auth/api/webLoginByPassword",
            headers: {
                'Content-Type': 'application/json',
                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
                'Referer': 'https://bbs.mihoyo.com/ys/'
            },
            body: JSON.stringify({ 
                account:account,
                password: gen.genMiHoYoRSApw(password),
                mmt_key,
                is_bh2: false,
                is_crypto: true,
                geetest_challenge: gc,
                geetest_validate: gv,
                geetest_seccode: gv+"|jordan",
                token_type: 6
            }),
            jar: j
        }).then((response) => {
            response = JSON.parse(response)          
            if(response.retcode !== 0){
                logger.error('登录接口报错 %s', response.message)
                reject(response.message)
                return
            }
            cookie = j.getCookies('https://api-takumi.mihoyo.com/account/auth/api/webLoginByPassword')
            //后期会改为直接设置cookie
            resolve(cookie)
        }).catch(error => {
            logger.error('登录接口报错 %o', error)
            reject(error)
        })
    })
}

const getMmt = () => {
    return new Promise((resolve, reject) =>{
        http({
            method: "GET",
            url: "https://webapi.account.mihoyo.com/Api/create_mmt",
            qs:{
                scene_type: 1,
                now: Date.now() / 1000 | 0,
                t: Date.now() / 1000 | 0,
                reason: 'user.mihoyo.com%23%2Flogin%2Fcaptcha'
            }
        }).then((response) => {
            response = JSON.parse(response)
            if(response.code !== 200){
                logger.error('mmt接口报错 %s', response.data.message)
                reject(response.message)
                return
            }
            resolve(response.data.mmt_data)
        }).catch(error => {
            logger.error('mmt接口报错 %o', error)
            reject(error)
        })
    })
}

const getRSApw = (pw) => {
    return gen.genMiHoYoRSApw(pw)
}
module.exports = {
    login,
    getMmt,
    getRSApw
}