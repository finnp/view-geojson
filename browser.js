var L = require('leaflet')
const {parse} = require('ndjson')
var geojsonStream = require('leaflet-stream')

const wsUrl = new URL(location.href)
wsUrl.protocol = 'ws'
const ws = new WebSocket(wsUrl.href)
ws.binaryType = 'arraybuffer'

var map = require('leaflet-default')()
const parser = parse()
parser.pipe(geojsonStream(map))

ws.onclose = (ev) => {
	if (ev.wasClean) {
		parser.end()
	} else {
		const err = new Error(`WebSocket closed: ${ev.code} ${ev.reason}`)
		err.code = ev.code
		parser.destroy(err)
	}
}
ws.onmessage = (ev) => {
	parser.write(Buffer.from(ev.data))
}
