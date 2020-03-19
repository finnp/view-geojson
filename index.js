const {dirname} = require('path')
const send = require('send')
var connect = require('connect')
var path = require('path')
var fs = require('fs')
var http = require('http')
const {Server: WsServer, createWebSocketStream} = require('ws')
var PassThrough = require('stream').PassThrough

const pathToMapboxGlCss = require.resolve('mapbox-gl/dist/mapbox-gl.css')
const pathToMapboxGlDist = dirname(pathToMapboxGlCss)

const serve = (router, path, root) => {
  router.use(path, (req, res, next) => {
    const {pathname} = new URL(req.url, 'http://foo')
    send(req, pathname, {root}).pipe(res)
  })
}

module.exports = function (opts) {
  opts = opts || {}
  var port = opts.port || 9966

  const router = connect()
  serve(router, '/mapbox', pathToMapboxGlDist)
  serve(router, '/', __dirname)

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



