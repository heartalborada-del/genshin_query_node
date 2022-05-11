const express = require("express")
const pino = require("pino")
const query = require("./utils/query")
const DS = require("./utils/DS")
const login = require("./utils/login")
var bodyParser = require('body-parser');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

const app = express()
const openCN = true
const openOS = false
app.use(bodyParser.urlencoded({ extended: false }))
app.set("trust proxy", true)
app.use(express.static('./static'))

app.all('*', (req, res, next) => {
    const { origin, Origin, referer, Referer } = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    if (req.method !== 'GET' && req.method !== 'POST' && req.method !==
       'OPTIONS') {
        return res.json({
            msg: 'Cannot ' + req.method,
            code: -1
        })
    }
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
})

app.get('/', function(req, res) {
    res.json({W:'1111'})
})
if (openCN) {
    app.all('/api/cn/roleInfo', function(req, res) {
        var uid = req.query.uid
        if (req.method == 'POST') {
            var uid = req.body.uid
        }
        new query.CN().getRoleInfo({ uid }).then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })

    app.all('/api/cn/getuserinfo', function(req, res) {
        var uid = req.query.uid
        var region = req.query.region
        if (req.method == 'POST') {
            var uid = req.body.uid
            var region = req.body.region
        }
        new query.CN().getUserInfo({ uid, region }).then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })

    app.all('/api/cn/getspiralabyss', function(req, res) {
        var uid = req.query.uid
        var region = req.query.region
        var schedule_type = req.query.schedule_type
        if (req.method == 'POST') {
            var uid = req.body.uid
            var region = req.body.region
            var schedule_type = req.body.schedule_type
        }
        new query.CN().getSpiralAbyss({ uid, region, schedule_type }).then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })

    app.all('/api/cn/getmmt', function(req,res) {
        login.getMmt().then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })
    app.post('/api/cn/login',function(req,res) {
        var account = req.body.account
        var password = req.body.password
        var mmt_key = req.body.mmt_key
        var challenge = req.body.challenge
        var validate = req.body.validate
        login.login({
            account,
            password,
            mmt_key,
            gc:challenge,
            gv:validate
        }).then(data => {
            res.json(data)
        }).catch(error => {
            res.json({
                msg: error,
                code: -1
            })
        })
    })
}
if (openOS) {
    app.all('/api/os/roleInfo', function(req, res) {
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

    app.all('/api/os/getuserinfo', function(req, res) {
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

    app.all('/api/os/getspiralabyss', function(req, res) {
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
const listener = app.listen(3000, () => {
    logger.info('Your app is listening on port ' + listener.address().port)
})