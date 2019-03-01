const hdf5Lib = require('hdf5')
const fs = require('fs')
const rimraf = require('rimraf')
const path = require('path')
const png = require('pngjs')
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default

const { PNG } = png
const hdf5 = hdf5Lib.hdf5
const h5lt = hdf5Lib.h5lt

const knpBoundary = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'geojson', 'knp_boundary.geojson'), 'utf-8'))

const create = (hdf5SourceDir, outputDir, date) => {
  let accumulatedNDVI = 0
  let numberOfPixels = 0
  let tilesMeta = {}
  fs
    .readdirSync(hdf5SourceDir)
    .filter(hdf5Filename => /.hdf5$/.exec(hdf5Filename))
    .forEach((hdf5Filename, i) => {
      const file = new hdf5.File(path.resolve(path.join(hdf5SourceDir, hdf5Filename)))
      const lons = h5lt.readDataset(file.id, 'lon')
      const lats = h5lt.readDataset(file.id, 'lat')
      const ndvi = h5lt.readDataset(file.openGroup('LEVEL3').openGroup('NDVI').id, 'NDVI')

      const match = /PROBAV_S10_TOC_X([0-9]{2})Y([0-9]{2})_[0-9]{8}_1KM_NDVI_V10[12]{1}.hdf5/.exec(hdf5Filename)
      const xTile = match[1]
      const yTile = match[2]
      const tileName = `X${xTile}Y${yTile}`

      const geometry = file.openGroup('LEVEL3/GEOMETRY')
      geometry.refresh()
      const meta = {
        bottomLeft: [geometry.BOTTOM_LEFT_LONGITUDE, geometry.BOTTOM_LEFT_LATITUDE],
        topLeft: [geometry.TOP_LEFT_LONGITUDE, geometry.TOP_LEFT_LATITUDE],
        bottomRight: [geometry.BOTTOM_RIGHT_LONGITUDE, geometry.BOTTOM_RIGHT_LATITUDE],
        topRight: [geometry.TOP_RIGHT_LONGITUDE, geometry.TOP_RIGHT_LATITUDE]
      }
      tilesMeta[tileName] = meta

      const pngFilename = `${tileName}.png`
      const pngPath = path.join(outputDir, pngFilename)
      var png = new PNG({
        width: lons.length,
        height: lats.length,
        colorType: 6
      })
      for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
          const idx = (png.width * y + x) << 2
          const ndviForPixel = ndvi[png.width * y + x]
          png.data[idx] = 0
          png.data[idx + 1] = ndviForPixel
          png.data[idx + 2] = 0
          png.data[idx + 3] = ndviForPixel === 255 ? 0 : 255

          if ((png.width * y + x) % 100 === 0) {
            process.stdout.cursorTo(0)
            process.stdout.write(`[${png.width * y + x}/${png.height * png.width}]`)
          }
          if (ndvi[png.width * y + x] === 255) {
            png.data[idx + 3] = 0
          } else {
            // If NDVI value !== 255, it's a valid value
            // Crop inside boundary
            const lon = geometry.BOTTOM_LEFT_LONGITUDE + 1 / 112 * x
            const lat = geometry.TOP_RIGHT_LATITUDE - 1 / 112 * y
            const coords = [lon, lat]
            const inside = booleanPointInPolygon(coords, knpBoundary.features[0].geometry)
            if (inside) {
              png.data[idx + 3] = 255
              numberOfPixels += 1
              accumulatedNDVI += ndviForPixel
            } else {
              png.data[idx + 3] = 0
            }
          }
        }
      }
      process.stdout.cursorTo(0)
      console.log('>>', date, pngFilename)
      const buffer = PNG.sync.write(png)
      fs.writeFileSync(pngPath, buffer)
    })
  return { tilesMeta, accumulatedNDVI, numberOfPixels }
}

const orderPath = path.join(__dirname, '..', '..', 'resources', 'C0177822')
const outputPath = path.join(__dirname, '..', '..', 'static', 'KNP')
rimraf.sync(outputPath)
const siteDB = fs
  .readdirSync(orderPath)
  .map(directory => {
    const match = /PV_S10_TOC_NDVI_([0-9]{8})_1KM_V10[12]{1}/.exec(directory)
    return [directory, match[1]]
  })
  .reduce((acc, [directory, date]) => {
    const outputDir = path.join(outputPath, date)
    rimraf.sync(outputDir)
    fs.mkdirSync(outputDir, { recursive: true })
    const meta = create(path.join(orderPath, directory), outputDir, date)
    acc[date] = meta
    return acc
  }, {})
fs.writeFileSync(path.join(outputPath, 'site.json'), JSON.stringify(siteDB), 'utf-8')
