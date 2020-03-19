var connect = require('connect')
var path = require('path')
var fs = require('fs')
var http = require('http')
const {Server: WsServer, createWebSocketStream} = require('ws')
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

  const server = http.createServer(router)
  server.listen(port)
  const wsServer = new WsServer({server})

  var input = new PassThrough({objectMode: true})
  wsServer.on('connection', (ws) => {
    const sink = createWebSocketStream(ws)
    input.pipe(sink)
    sink.once('close', () => {
      input.unpipe(sink)
    })
  })

  input.stop = server.close.bind(server)
  return input
}



