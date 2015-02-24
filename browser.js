var L = require('leaflet')
var ssejson = require('ssejson')
var geojsonStream = require('leaflet-geojson-stream')

var map = require('leaflet-default')()
var geojson = L.geoJson().addTo(map)

ssejson.fromEventSource('/sse')
  .pipe(geojsonStream.layerPipe(geojson))

