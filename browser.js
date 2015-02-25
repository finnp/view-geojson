var L = require('leaflet')
var ssejson = require('ssejson')
var geojsonStream = require('leaflet-stream')

var map = require('leaflet-default')()

ssejson.fromEventSource('/sse')
  .pipe(geojsonStream(map))

