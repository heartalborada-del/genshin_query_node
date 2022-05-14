const md5 = require("md5-node")
const stringRandom = require('string-random')
  
const randomInt = (min, max) => {
  // [min, max)
    return Math.floor(Math.random() * (max - min)) + min
}
  
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

const getCNDS = (query, body = "") => {
    const s = "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs"
    const t = Date.now() / 1000 | 0
    const r = randomInt(100001, 200000)
    const q = getQueryParam(query)
    const c = md5(`salt=${s}&t=${t}&r=${r}&b=${body}&q=${q}`)
    return `${t},${r},${c}`
}

const getOSDS = () => {
    const n = "6cqshh5dhw73bzxn20oexa9k516chk7s"
    const t = Date.now() / 1000 | 0
    const r = stringRandom(6)
    const c = md5(`salt=${n}&t=${t}&r=${r}`)
    return `${t},${r},${c}`
}

module.exports = {
    getCNDS,
    getOSDS
}