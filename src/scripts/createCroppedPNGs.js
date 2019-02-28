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
const zaf = JSON.parse(fs.readFileSync(path.join(countriesSourceDir, 'archive', 'zaf.geojson'), 'utf-8'))

fs
  .readdirSync(hdf5SourceDir)
  .filter(filename => /.hdf5$/.exec(filename))
  .forEach((filename, i) => {
    const file = new hdf5.File(path.resolve(path.join(hdf5SourceDir, filename)))
    const lon = h5lt.readDataset(file.id, 'lon')
    const lat = h5lt.readDataset(file.id, 'lat')
    const ndvi = h5lt.readDataset(file.openGroup('LEVEL3').openGroup('NDVI').id, 'NDVI')

    const geometry = file.openGroup('LEVEL3/GEOMETRY')
    geometry.refresh()
    const meta = {
      bottomLeft: [geometry.BOTTOM_LEFT_LONGITUDE, geometry.BOTTOM_LEFT_LATITUDE],
      topLeft: [geometry.TOP_LEFT_LONGITUDE, geometry.TOP_LEFT_LATITUDE],
      bottomRight: [geometry.BOTTOM_RIGHT_LONGITUDE, geometry.BOTTOM_RIGHT_LATITUDE],
      topRight: [geometry.TOP_RIGHT_LONGITUDE, geometry.TOP_RIGHT_LATITUDE]
    }
    const metaFilename = `${/(.*)\.hdf5$/.exec(filename)[1]}.json`
    const metaPath = path.join(hdf5SourceDir, metaFilename)
    fs.writeFileSync(metaPath, JSON.stringify(meta), 'utf-8')
    console.log('>>', metaFilename)

    const pngFilename = `${/(.*)\.hdf5$/.exec(filename)[1]}.cropped.png`
    const pngPath = path.join(hdf5SourceDir, pngFilename)
    var png = new PNG({
      width: lon.length,
      height: lat.length,
      colorType: 6
    })
    for (var y = 0; y < png.height; y++) {
      for (var x = 0; x < png.width; x++) {
        const idx = (png.width * y + x) << 2
        png.data[idx] = 0
        png.data[idx + 1] = ndvi[png.width * y + x]
        png.data[idx + 2] = 0
        png.data[idx + 3] = ndvi[png.width * y + x] === 255 ? 0 : 255

        if ((png.width * y + x) % 100 === 0) {
          process.stdout.cursorTo(0)
          process.stdout.write(`[${png.width * y + x}/${png.height * png.width}]`)
        }
        if (ndvi[png.width * y + x] === 255) {
          png.data[idx + 3] = 0
        } else {
          // If NDVI value !== 255, it's a valid value
          // Crop inside boundary
          const coords = [lon[x], lat[y]]
          const inside = booleanPointInPolygon(coords, zaf.geometry)
          if (inside) {
            png.data[idx + 3] = 255
          } else {
            png.data[idx + 3] = 0
          }
        }
      }
    }
    png.pack().pipe(fs.createWriteStream(pngPath))
    console.log('>>', pngFilename)
  })
