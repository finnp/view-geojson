#!/usr/bin/env node

var viewGeojson = require('./')
const mri = require('mri')
const pkg = require('./package.json')
var json = require('JSONStream')
var open = require('open')
var fs = require('fs')

const args = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
	]
})

if (args.help || args.h) {
	process.stdout.write(`\
cat feature1.geojson feature2.geojson | view-geojson
view-geojson < data.ndjson
view-geojson feature1.geojson
`)
	process.exit()
}
if (args.version || args.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit()
}

var port = 9966

var input = process.stdin

if (args._[0]) {
  input = fs.createReadStream(args._[0])
}

input
  .pipe(json.parse())
  .pipe(viewGeojson(port))

open('http://localhost:' + port)
