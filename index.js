const express = require("express")
const pino = require("pino")
const query = require("./utils/query")
const login = require("./utils/login")
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path')

const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

const app = express()

const openCN = true
const openOS = false
const openWEB = true

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.set("trust proxy", true)

app.all('*', (req, res, next) => {
    const { origin, Origin, referer, Referer } = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
})
if (openWEB) {
    app.use(express.static(path.join(__dirname, 'static')))
}
if (openCN) {
    app.all('/api/cn/roleInfo', function (req, res) {
        var cookie = ''
        for (var key in req.cookies) {
            cookie = cookie + key + '=' + req.cookies[key] + ";"
            res.cookie(key, req.cookies[key], {
                maxAge: -1
            })
        }
        var uid = req.query.uid
        if (req.method == 'POST') {
            var uid = req.body.uid
        }
        new query.CN().getRoleInfo({ uid, cookie }).then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })

    app.all('/api/cn/getuserinfo', function (req, res) {
        var cookie = ''
        for (var key in req.cookies) {
            cookie = cookie + key + '=' + req.cookies[key] + ";"
            res.cookie(key, req.cookies[key], {
                maxAge: -1
            })
        }
        var uid = req.query.uid
        var region = req.query.region
        if (req.method == 'POST') {
            var uid = req.body.uid
            var region = req.body.region
        }
        new query.CN().getUserInfo({ uid, region, cookie }).then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })

    app.all('/api/cn/getspiralabyss', function (req, res) {
        var cookie = ''
        for (var key in req.cookies) {
            cookie = cookie + key + '=' + req.cookies[key] + ";"
            res.cookie(key, req.cookies[key], {
                maxAge: -1
            })
        }
        var uid = req.query.uid
        var region = req.query.region
        var schedule_type = req.query.schedule_type
        if (req.method == 'POST') {
            var uid = req.body.uid
            var region = req.body.region
            var schedule_type = req.body.schedule_type
        }
        new query.CN().getSpiralAbyss({ uid, region, schedule_type, cookie }).then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })

    app.all('/api/cn/getmmt', function (req, res) {
        login.getMmt().then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })

    app.post('/api/cn/login', function (req, res) {
        var account = req.body.account
        var password = req.body.password
        var mmt_key = req.body.mmt_key
        var challenge = req.body.challenge
        var validate = req.body.validate
        login.login({
            account,
            password,
            mmt_key,
            gc: challenge,
            gv: validate
        }).then(data => {
            for (var key in data.cookie) {
                res.cookie(
                    data.cookie[key].key,
                    data.cookie[key].value,
                    {
                        maxAge: data.cookie[key]['maxAge'],
                        path: '/api/cn/',
                        hostOnly: data.cookie[key]['hostOnly'],
                        httpOnly: data.cookie[key]['httpOnly']
                    })
            }
            res.json({
                msg: data.data.message,
                code: data.data.retcode,
                data: data.data.data.account_info,
            })
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })

    app.post('/api/cn/logout', function (req, res) {
        var cookie = ''
        for (var key in req.cookies) {
            cookie = cookie + key + '=' + req.cookies[key] + ";"
            res.cookie(key, req.cookies[key], {
                maxAge: -1
            })
        }
        login.logout({ cookie }).then(data => {
            for (var key in data.cookie) {
                res.cookie(
                    data.cookie[key].key,
                    data.cookie[key].value,
                    {
                        maxAge: data.cookie[key]['maxAge'],
                        path: '/api/cn/',
                        hostOnly: data.cookie[key]['hostOnly'],
                        httpOnly: data.cookie[key]['httpOnly']
                    })
            }
            res.json({
                msg: data.data.message,
                code: data.data.retcode,
            })
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })
}
if (openOS) {
    app.all('/api/os/roleInfo', function (req, res) {
        var uid = req.query.uid
        if (req.method == 'POST') {
            var uid = req.body.uid
        }
        new query.OS().getRoleInfo({ uid }).then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })

    app.all('/api/os/getuserinfo', function (req, res) {
        var uid = req.query.uid
        var region = req.query.region
        if (req.method == 'POST') {
            var uid = req.body.uid
            var region = req.body.region
        }
        new query.OS().getUserInfo({ uid, region }).then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })

    app.all('/api/os/getspiralabyss', function (req, res) {
        var uid = req.query.uid
        var region = req.query.region
        var schedule_type = req.query.schedule_type
        if (req.method == 'POST') {
            var uid = req.body.uid
            var region = req.body.region
            var schedule_type = req.body.schedule_type
        }
        new query.OS().getSpiralAbyss({ uid, region, schedule_type }).then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })
}
const listener = app.listen(5500, () => {
    logger.info('Your app is listening on port ' + listener.address().port)
})