#!/usr/bin/env node

var viewGeojson = require('./')
var json = require('JSONStream')
var open = require('open')
var args = process.argv.splice(2)
var fs = require('fs')

var port = 9966

var input = process.stdin

if(args[0]) {
  input = fs.createReadStream(args[0])
}

input
  .pipe(json.parse())
  .pipe(viewGeojson(port))

open('http://localhost:' + port)
