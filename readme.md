# view-geojson
[![NPM](https://nodei.co/npm/view-geojson.png)](https://nodei.co/npm/view-geojson/)

Pipe geojson into it and it opens a browser with a map

```
npm install view-geojson -g
```

## Example

```sh
Usage:
	cat feature1.geojson feature2.geojson | view-geojson
	view-geojson --app firefox < data.ndjson
	view-geojson --port 8080 feature1.geojson
Options:
	--no-open  -n  Don't try to open the map.
	--app          App to open the map URL with.
	--port     -p  Port to listen on.
```

## Programmatic usage

```js
var viewGeojson = require('view-geojson')

// default opts
var opts = {
  port: 9966
}

objectstream.pipe(viewGeojson(opts))
```