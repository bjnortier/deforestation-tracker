import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fetch from 'isomorphic-fetch'
import styled from 'styled-components'
import { TimeXScalarYGraph } from 'react-svg-graphs'
import ReactResizeDetector from 'react-resize-detector'

import Map from './Map'

const httpGet = (path) => {
  return fetch(path, {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      return Promise.all([response.status, response.json()])
    })
}

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 200px;
`

const GraphContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  height: 200px;
`

class Site extends Component {
  constructor (props) {
    super(props)
    this.state = {
      site: null,
      error: null,
      currentIndex: null
    }
  }

  componentDidMount () {
    httpGet(`/static/${this.props.id}/site.json`)
      .then(([status, json]) => {
        if (status === 200) {
          this.setState({
            site: json,
            currentIndex: Object.keys(json).length - 1
          })
        } else {
          this.setState({ error: json })
        }
      }, err => {
        console.error(err)
        this.setState({ error: err.message })
      })
  }

  render () {
    const { site, currentIndex, error } = this.state
    if (!site) {
      if (!error) {
        return <div>reading...</div>
      } else {
        return <div>{error}</div>
      }
    } else {
      const dates = Object.keys(site)
      const xValues = dates.map(date => {
        const match = /([0-9]{4})([0-9]{2})([0-9]{2})/.exec(date)
        const year = match[1]
        const month = match[2]
        const day = match[3]
        return new Date(`${year}-${month}-${day}`).getTime()
      })
      const yValues = dates.map(date => site[date].accumulatedNDVI / 1e6)
      const data = {
        x: {
          label: 't',
          values: xValues
        },
        y: [
          {
            label: 'Acc. NDVI',
            values: yValues
          }
        ]
      }
      return <FullScreen>
        <MapContainer>
          <Map
            site={site}
            currentDate={dates[currentIndex]}
          />
        </MapContainer>
        <GraphContainer>
          <ReactResizeDetector handleWidth>
            {(width, height) => <TimeXScalarYGraph
              data={data}
              width={width || 640}
              height={200}
              title='Kruger National Park Accumulated NDVI 1e6'
              periodLabel='7y'
              onHover={hoverInfo => this.setState({ currentIndex: hoverInfo.xIndex })}
            />}
          </ReactResizeDetector>
        </GraphContainer>
      </FullScreen>
    }
  }
}

Site.propTypes = {
  id: PropTypes.string.isRequired
}

export default Site
