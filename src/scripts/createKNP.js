const fs = require('fs')
const rimraf = require('rimraf')
const path = require('path')

const createPNGs = require('./createPNGs')

const knpBoundary = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'geojson', 'knp_boundary.geojson'), 'utf-8'))

/**
 * 1. Delete any existing static/KNP directory
 * 2. Read all the HDF files from the resources/ directory
 * 3. Create tiles and metadata for all the tiles
 * 4. Write the site.json which contains all the tile metadata
 */
const resourcePath = path.join(__dirname, '..', '..', 'resources')
const rootOutputPath = path.join(__dirname, '..', '..', 'static', 'KNP')
rimraf.sync(rootOutputPath)
const siteDB = fs
  .readdirSync(resourcePath)
  .filter(directory => /PV_S10_TOC_NDVI_([0-9]{8})_1KM_V10[12]{1}/.exec(directory))
  .map(directory => {
    // parse the YYYMM date from the directory name
    const match = /PV_S10_TOC_NDVI_([0-9]{8})_1KM_V10[12]{1}/.exec(directory)
    return [directory, match[1]]
  })
  .reduce((acc, [hdf5Directory, date]) => {
    const datumPath = path.join(rootOutputPath, date)
    fs.mkdirSync(datumPath, { recursive: true })
    const meta = createPNGs(knpBoundary, resourcePath, hdf5Directory, date, datumPath)
    acc.data[date] = meta
    return acc
  }, { data: {} })
siteDB.boundary = knpBoundary
fs.writeFileSync(path.join(rootOutputPath, 'site.json'), JSON.stringify(siteDB), 'utf-8')
