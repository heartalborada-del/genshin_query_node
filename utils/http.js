const request = require('request')

function http(options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error)
      }
      resolve(body,response)
    })
  })
  .catch(error => console.error(error))
}
module.exports = http