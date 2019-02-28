import React, { Component } from 'react'
import ReactMapGL, { NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'

const knpBoundary = require('../geojson/knp_boundary.geojson')

const dates = require('../../static/KNP/dates.json')
const date = dates[0]

const tiles = ['X21Y09', 'X21Y10']
const metas = tiles.map(tile => require(`../../static/KNP/${date}/${tile}.meta.json`))

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
    this.setState({ viewport })
  }

  getMap () {
    return this.mapRef.current ? this.mapRef.current.getMap() : null
  }

  componentDidMount () {
    const map = this.getMap()
    map.on('load', data => {
      for (let i = 0; i < tiles.length; ++i) {
        const tile = tiles[i]
        map.addSource(tile, {
          'type': 'image',
          'url': `/static/KNP/${date}/${tile}.png`,
          'coordinates': [
            metas[i].topLeft,
            metas[i].topRight,
            metas[i].bottomRight,
            metas[i].bottomLeft
          ]
        })
        map.addLayer({
          id: tile,
          source: tile,
          type: 'raster',
          paint: {
            'raster-opacity': 1
          }
        })
        map.moveLayer(tiles[i], 'waterway')
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
