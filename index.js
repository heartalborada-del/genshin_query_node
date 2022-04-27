const express = require("express");
const pino = require("pino");

const logger = pino({level: process.env.LOG_LEVEL || 'info'});

const app = express();
app.set("trust proxy",true);

app.get('/',function (req, res){
    res.send('test ');
})

const server = app.listen(8081,function(){
    console.log("start")
})