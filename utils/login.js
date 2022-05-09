const gen = require('./gen')
const http = require('./http')
const pino = require("pino")
const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

const login = ({account,password,mmt_key,gc,gv,gs}) => {
    return new Promise((resolve, reject) =>{
        http({
            method: "POST",
            url: "https://api-takumi.mihoyo.com/account/auth/api/webLoginByPassword",
            form:{ 
                account,
                password: gen.getMiHoYoRSAPassword(password),
                mmt_key,
                is_crypto: true,
                geetest_challenge: gc,
                geetest_validate: gv,
                geetest_seccode: gs,
                source: '',
                t: Date.now() / 1000 | 0
            }
        }).then((response,head) => {
            response = JSON.parse(response)
            if(response.retcode !== 0){
                logger.error('登录接口报错 %s', response.message)
                reject(response.message)
                return
            }
            console.log(response)
            cookie = head['set-cookie']
            console.log(cookie)
            resolve(cookie)
        }).catch(error => {
            logger.error('登录接口报错 %o', error)
            reject(error)
        })
    })
}

const genMmt = () => {
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
        }).then((response,head) => {
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

module.exports = {
    login,
    genMmt
}