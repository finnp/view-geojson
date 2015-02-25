var ssejson = require('ssejson')
var Router = require('routes-router')
var path = require('path')
var fs = require('fs')
var http = require('http')
var PassThrough = require('stream').PassThrough

module.exports = function (opts) {
  opts = opts {}
  var port = opts.port || 9966
  var router = Router()
  router.addRoute('/', function (req, res) {
    fs.createReadStream(path.join(__dirname, 'index.html'))
      .pipe(res)
  })

  router.addRoute('/bundle.js', function (req, res) {
    fs.createReadStream(path.join(__dirname, 'bundle.js'))
      .pipe(res)
  })

  var input = new PassThrough({objectMode: true})
  
  router.addRoute('/sse', function (req, res) {
    res.setHeader('Content-Type', 'text/event-stream')
    input
      .pipe(ssejson.serialize())
      .pipe(res)
  })
  http.createServer(router).listen(port)

  return input
}



