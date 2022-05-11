const crypto = require('crypto')
const NodeRSA = require('node-rsa')

const MiyousheKey = 'd0d3a7342df2026a70f650b907800111'
const MiyoushepubKey ='-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDvekdPMHN3AYhm/vktJT+YJr7\ncI5DcsNKqdsx5DZX0gDuWFuIjzdwButrIYPNmRJ1G8ybDIF7oDW2eEpm5sMbL9zs\n9ExXCdvqrn51qELbqj0XxtMTIpaCHFSI50PfPpTFV9Xt/hmyVwokoOXFlAEgCn+Q\nCgGs52bFoYMtyi+xEQIDAQAB\n-----END PUBLIC KEY-----'
const getQueryParam = (data) => {
    if (data === undefined) {
      return ""
    }
    const arr = []
    for (let key of Object.keys(data)) {
      arr.push(`${key}=${data[key]}`)
    }
    return arr.join("&")
}

const genMiyousheSign = (params) => {
    p = getQueryParam(params)
    return crypto.createHmac('sha256', MiyousheKey).update(p).digest('hex')
}

const genMiHoYoRSApw = (password) => {
    const nodeRSA = new NodeRSA(MiyoushepubKey)
    nodeRSA.setOptions({ encryptionScheme: 'pkcs1' })
    return nodeRSA.encrypt(password, 'base64')
}

module.exports = {
    genMiyousheSign,
    genMiHoYoRSApw
}