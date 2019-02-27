const hdf5Lib = require('hdf5')
const fs = require('fs')
const path = require('path')
const png = require('pngjs')

const { PNG } = png
const hdf5 = hdf5Lib.hdf5
const h5lt = hdf5Lib.h5lt

const hdf5SourceDir = path.join(__dirname, '..', '..', 'resources', 'PV_S10_TOC_NDVI_20190211_1KM_V101')

fs
  .readdirSync(hdf5SourceDir)
  .filter(filename => /.hdf5$/.exec(filename))
  .forEach(filename => {
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
    console.log('>>', metaPath)

    const pngFilename = `${/(.*)\.hdf5$/.exec(filename)[1]}.png`
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
      }
    }
    png.pack().pipe(fs.createWriteStream(pngPath))
    console.log('>>', pngPath)
  })
