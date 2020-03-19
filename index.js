var ssejson = require('ssejson')
var connect = require('connect')
var path = require('path')
var fs = require('fs')
var http = require('http')
var PassThrough = require('stream').PassThrough

module.exports = function (opts) {
  opts = opts || {}
  var port = opts.port || 9966

  const router = connect()
  router.use('/bundle.js', (req, res) => {
    fs.createReadStream(path.join(__dirname, 'bundle.js'))
      .pipe(res)
  })
  router.use('/', (req, res) => {
    fs.createReadStream(path.join(__dirname, 'index.html'))
      .pipe(res)
  })

  var input = new PassThrough({objectMode: true})
  router.use('/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    input
      .pipe(ssejson.serialize())
      .pipe(res)
  })
  http.createServer(router).listen(port)

  return input
}



