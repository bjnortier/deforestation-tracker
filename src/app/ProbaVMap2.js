import React, { Component } from 'react'
import ReactMapGL, { NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'

// const datasetNames = [
//   'PROBAV_S10_TOC_X19Y09_20190211_1KM_NDVI_V101',
//   'PROBAV_S10_TOC_X19Y10_20190211_1KM_NDVI_V101',
//   'PROBAV_S10_TOC_X20Y09_20190211_1KM_NDVI_V101',
//   'PROBAV_S10_TOC_X20Y10_20190211_1KM_NDVI_V101',
//   'PROBAV_S10_TOC_X21Y09_20190211_1KM_NDVI_V101',
//   'PROBAV_S10_TOC_X21Y10_20190211_1KM_NDVI_V101'
// ]
// const tiles = datasetNames.map(name => require(`../../resources/PV_S10_TOC_NDVI_20190211_1KM_V101/${name}.cropped.png`))
// const metas = datasetNames.map(name => require(`../../resources/PV_S10_TOC_NDVI_20190211_1KM_V101/${name}.json`))

// const zaf = require('../../core/geo-countries/archive/zaf.geojson')
const knpBoundary = require('../geojson/knp_boundary.geojson')
console.log('@@', knpBoundary)

class ProbaVMap extends Component {
  constructor (props) {
    super(props)
    this.state = {
      viewport: {
        width: '100%',
        height: '100%',
        zoom: 6,
        latitude: -23.92,
        longitude: 31.65
      }
    }
    this.handleViewportChange = this.handleViewportChange.bind(this)
    this.mapRef = React.createRef()
  }

  handleViewportChange (viewport) {
    console.log('@@', viewport)
    this.setState({ viewport })
  }

  getMap () {
    return this.mapRef.current ? this.mapRef.current.getMap() : null
  }

  componentDidMount () {
    const map = this.getMap()
    map.on('load', data => {
      map.addLayer({
        id: '`knp-boundary`',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: knpBoundary.features[0].geometry
          }
        },
        layout: {},
        paint: {
          'line-color': '#ff0000',
          'line-width': 2
        }
      })
    })
  }

  render () {
    const { viewport } = this.state
    return <ReactResizeDetector
      handleWidth
      handleHeight
      refreshMode='throttle'
      refreshRate={500}
    >
      {(width, height) => <ReactMapGL
        ref={this.mapRef}
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
        {...viewport}
        width={width}
        height={height}
        mapStyle='mapbox://styles/4v-e/cjsket4mh0ty11foda52iviad'
        onViewportChange={this.handleViewportChange}
      >
        <div style={{ position: 'absolute', right: 16, top: 16 }}>
          <NavigationControl
            onViewportChange={this.handleViewportChange}
          />
        </div>
      </ReactMapGL>}
    </ReactResizeDetector>
  }
}

ProbaVMap.propTypes = {
  scrollZoom: PropTypes.bool.isRequired
}

ProbaVMap.defaultProps = {
  scrollZoom: true
}

export default ProbaVMap
