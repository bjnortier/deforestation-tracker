import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fetch from 'isomorphic-fetch'

import Map from './Map'
import Graph from './Graph'
import { FullScreen, MapContainer, GraphContainer } from './layout'

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
    fetch(`/static/KNP/site.json`, {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        return Promise.all([response.status, response.json()])
      })
      .then(([status, json]) => {
        if (status === 200) {
          this.setState({
            site: json,
            currentIndex: Object.keys(json.data).length - 1
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
      const dates = Object.keys(site.data)
      return <FullScreen>
        <MapContainer><Map
          site={site}
          currentDate={dates[currentIndex]}
        /></MapContainer>
        <GraphContainer><Graph
          siteData={site.data}
          dates={dates}
          onHover={hoverInfo => this.setState({ currentIndex: hoverInfo.xIndex })}
        /></GraphContainer>
      </FullScreen>
    }
  }
}

export default Site
