# view-geojson
[![NPM](https://nodei.co/npm/view-geojson.png)](https://nodei.co/npm/view-geojson/)

Pipe geojson into it and it opens a browser with a map

```
npm install view-geojson -g
```

## Example

```sh
cat feature1.geojson feature2.geojson | view-geojson
view-geojson < data.ndjson
view-geojson feature1.geojson
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