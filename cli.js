#!/usr/bin/env node

var json = require('JSONStream')
var ssejson = require('ssejson')
var Router = require('routes-router')
var path = require('path')
var fs = require('fs')
var http = require('http')
var open = require('open')

var router = Router()
var port = 9966

var args = process.argv.splice(2)


router.addRoute('/', function (req, res) {
  fs.createReadStream(path.join(__dirname, 'index.html'))
    .pipe(res)
})

router.addRoute('/bundle.js', function (req, res) {
  fs.createReadStream(path.join(__dirname, 'bundle.js'))
    .pipe(res)
})

router.addRoute('/sse', function (req, res) {
  res.setHeader('Content-Type', 'text/event-stream')
  if(args[0]) {
    fs.createReadStream(args[0])
  }
  process.stdin
    .pipe(json.parse())
    .pipe(ssejson.serialize())
    .pipe(res)
})

open('http://localhost:' + port)
http.createServer(router).listen(port)

