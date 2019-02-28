const hdf5Lib = require('hdf5')
const fs = require('fs')
const path = require('path')
const png = require('pngjs')
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default

const { PNG } = png
const hdf5 = hdf5Lib.hdf5
const h5lt = hdf5Lib.h5lt
const hdf5SourceDir = path.join(__dirname, '..', '..', 'resources', 'PV_S10_TOC_NDVI_20190211_1KM_V101')

const countriesSourceDir = path.join(__dirname, '..', '..', 'core', 'geo-countries')
const countries = JSON.parse(fs.readFileSync(path.join(countriesSourceDir, 'archive', 'countries.geojson'), 'utf-8'))
let zaf
for (let i = 0, il = countries.features.length; i < il; ++i) {
  if (countries.features[i].properties.ISO_A3 === 'ZAF') {
    zaf = countries.features[i]
    break
  }
}
fs.writeFileSync(path.join(countriesSourceDir, 'archive', 'zaf.geojson'), JSON.stringify(zaf), 'utf-8')
