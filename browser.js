const {parse} = require('ndjson')
const pick = require('lodash.pick')

const wsUrl = new URL(location.href)
wsUrl.protocol = 'ws'
const ws = new WebSocket(wsUrl.href)
ws.binaryType = 'arraybuffer'

const style = {
	version: 8,
	sources: {
		osm: {
			type: 'raster',
			tiles: [
				'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
				'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
				'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
			],
			tileSize: 256,
			attribution: `\
© <a target="_top" rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>`
		}
	},
	layers: [{
		id: 'simple-tiles',
		type: 'raster',
		source: 'osm',
		minzoom: 0,
		maxzoom: 19
	}]
}

const map = new mapboxgl.Map({
	container: document.querySelector('#map'),
	style,
})
const parser = parse()

map.once('load', () => {
	let data = {type: 'FeatureCollection', features: []}

	map.addSource('data', {type: 'geojson', data})
	map.addLayer({
		id: 'fill',
		type: 'fill',
		source: 'data',
		paint: {
			'fill-color': '#51A7FF',
			'fill-opacity': .4,
		},
		filter: ['!=', '$type', 'Point'],
	})
	map.addLayer({
		id: 'line',
		type: 'line',
		source: 'data',
		paint: {
			'line-color': '#5892E8',
			'line-opacity': .7,
			'line-width': 1,
		},
		filter: ['!=', '$type', 'Point'],
	})
	map.addLayer({
		id: 'circle',
		type: 'circle', // todo: symbol
		source: 'data',
		paint: {
			'circle-radius': 6,
			'circle-color': '#5892E8',
		},
		filter: ['==', '$type', 'Point'],
	})

	parser.on('data', (item) => {
		if (item.type === 'FeatureCollection') {
			data = {
				type: 'FeatureCollection',
				features: [...data.features, ...item.features]
			}
		} else {
			data = {
				type: 'FeatureCollection',
				features: [...data.features, item]
			}
		}
		map.getSource('data').setData(data)
	})
})

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
