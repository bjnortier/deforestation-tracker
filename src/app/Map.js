import React, { Component } from 'react'
import ReactMapGL, { NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'

const tiles = ['X21Y09', 'X21Y10']
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
    const { directories } = this.props
    const map = this.getMap()
    map.on('load', data => {
      for (let j = 0; j < directories.length; ++j) {
        const directory = directories[j]
        for (let i = 0; i < tiles.length; ++i) {
          const tile = tiles[i]
          const [left, right, top, bottom] = tile === 'X21Y09'
            ? [30, 40, -15, -25]
            : [30, 40, -25, -35]
          const id = `${directory}/${tile}`
          map.addSource(id, {
            'type': 'image',
            'url': `/static/KNP/${directory}/${tile}.png`,
            'coordinates': [
              [left, top],
              [right, top],
              [right, bottom],
              [left, bottom]
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
          'line-color': '#fbff0a',
          'line-width': 2
        }
      })
      this.setState({ styleLoaded: true })
    })
  }

  render () {
    const { directories, currentIndex } = this.props
    const { viewport, styleLoaded } = this.state
    if (styleLoaded) {
      const map = this.getMap()
      directories.forEach((dir, i) => {
        if (currentIndex === i) {
          map.setLayoutProperty(`${dir}/X21Y09`, 'visibility', 'visible')
          map.setLayoutProperty(`${dir}/X21Y10`, 'visibility', 'visible')
        } else {
          map.setLayoutProperty(`${dir}/X21Y09`, 'visibility', 'none')
          map.setLayoutProperty(`${dir}/X21Y10`, 'visibility', 'none')
        }
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
  directories: PropTypes.array.isRequired,
  currentIndex: PropTypes.number.isRequired
}

export default Map
