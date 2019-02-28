const fs = require('fs')
const path = require('path')

const createCroppedPNGs = require('./createCroppedPNGs')

const orderPath = path.join(__dirname, '..', '..', 'resources', 'C0177821')
fs
  .readdirSync(orderPath)
  .forEach(directory => createCroppedPNGs(orderPath, directory))
