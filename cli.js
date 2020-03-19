#!/usr/bin/env node

var viewGeojson = require('./')
const mri = require('mri')
const pkg = require('./package.json')
var open = require('open')
var fs = require('fs')

const args = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'no-open', '-n',
	]
})

if (args.help || args.h) {
	process.stdout.write(`\
Usage:
	cat feature1.geojson feature2.geojson | view-geojson
	view-geojson --app firefox < data.ndjson
	view-geojson --port 8080 feature1.geojson
Options:
	--no-open  -n  Don't try to open the map.
	--app          App to open the map URL with.
	--port     -p  Port to listen on.
`)
	process.exit()
}
if (args.version || args.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit()
}

var port = args.port || args.p || 9966

var input = process.stdin

if (args._[0]) {
  input = fs.createReadStream(args._[0])
}

input
  .pipe(viewGeojson(port))

if (args['open'] !== false && args.n !== false) {
	open('http://localhost:' + port, {
		app: args.app,
	})
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
}
