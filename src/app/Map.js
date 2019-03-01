import React, { Component } from 'react'
import ReactMapGL, { NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'

const knpBoundary = require('../geojson/knp_boundary.geojson')

class Map extends Component {
  constructor (props) {
    super(props)
    this.state = {
      viewport: {
        width: '100%',
        height: '100%',
        zoom: 6,
        latitude: -23.92,
        longitude: 31.65
      },
      styleLoaded: false
    }
    this.handleViewportChange = this.handleViewportChange.bind(this)
    this.mapRef = React.createRef()
  }

  handleViewportChange (viewport) {
    this.setState({ viewport })
  }

  getMap () {
    return this.mapRef.current ? this.mapRef.current.getMap() : null
  }

  componentDidMount () {
    const { site } = this.props
    const map = this.getMap()
    map.on('load', data => {
      const dates = Object.keys(site)
      for (let j = 0; j < dates.length; ++j) {
        const date = dates[j]
        const tilesMeta = site[date].tilesMeta
        const tileNames = Object.keys(tilesMeta)
        for (let i = 0; i < tileNames.length; ++i) {
          const tileName = tileNames[i]
          const tileMeta = tilesMeta[tileName]
          const id = `${date}/${tileName}`
          map.addSource(id, {
            'type': 'image',
            'url': `/static/KNP/${date}/${tileName}.png`,
            'coordinates': [
              tileMeta.topLeft,
              tileMeta.topRight,
              tileMeta.bottomRight,
              tileMeta.bottomLeft
            ]
          })
          map.addLayer({
            id,
            source: id,
            type: 'raster',
            layout: {
              visibility: 'none'
            },
            paint: {
              'raster-opacity': 1
            }
          })
          map.moveLayer(id, 'waterway')
        }
      }
      map.addLayer({
        id: '`zaf-boundary`',
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
          'line-color': '#ff7f0e',
          'line-width': 2
        }
      })
      this.setState({ styleLoaded: true })
    })
  }

  render () {
    const { site, currentDate } = this.props
    const { viewport, styleLoaded } = this.state
    if (styleLoaded) {
      const map = this.getMap()
      Object.keys(site).forEach((date, i) => {
        Object.keys(site[date].tilesMeta).forEach(tileName => {
          if (date === currentDate) {
            map.setLayoutProperty(`${date}/${tileName}`, 'visibility', 'visible')
          } else {
            map.setLayoutProperty(`${date}/${tileName}`, 'visibility', 'none')
          }
        })
      })
    }
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

Map.propTypes = {
  site: PropTypes.object.isRequired,
  currentDate: PropTypes.string.isRequired
}

export default Map
