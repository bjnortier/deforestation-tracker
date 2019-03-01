import React, { Component } from 'react'
import { render } from 'react-dom'
import styled, { createGlobalStyle } from 'styled-components'
import styledNormalize from 'styled-normalize'
import { TimeXScalarYGraph } from 'react-svg-graphs'
import ReactResizeDetector from 'react-resize-detector'

import Map from './Map'

import directories from './directories'

const GlobalStyle = createGlobalStyle`
  ${styledNormalize}
  @import 'https://fonts.googleapis.com/css?family=Roboto+Mono:300,400,500';
  body {
    font-family: 'Roboto Mono', Serif;
    font-weight: 400;
    background-color: #e4e4e4;
    font-size: 12px;
    -webkit-font-smoothing: antialiased;
    color: black;
  }
`

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const GraphContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  height: 200px;
`

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 200px;
`

const dates = directories.map(name => {
  const match = /([0-9]{4})([0-9]{2})([0-9]{2})/.exec(name)
  const year = match[1]
  const month = match[2]
  const day = match[3]
  return new Date(`${year}-${month}-${day}`).getTime()
})

const data = {
  x: {
    label: 't',
    values: dates
  },
  y: [
    {
      label: 'NDVI',
      values: dates.map(d => 0)
    }
  ]
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentIndex: dates.length - 1
    }
  }

  render () {
    const { currentIndex } = this.state
    return <FullScreen>
      <GlobalStyle />
      <MapContainer>
        <Map
          directories={directories}
          currentIndex={currentIndex}
        />
      </MapContainer>
      <GraphContainer><ReactResizeDetector
        handleWidth
      >
        {(width, height) => <TimeXScalarYGraph
          data={data}
          width={width || 400}
          height={200}
          title={`Accumulated NDVI`}
          periodLabel='7y'
          onHover={hoverInfo => this.setState({ currentIndex: hoverInfo.xIndex })}
        />}
      </ReactResizeDetector></GraphContainer>
    </FullScreen>
  }
}

render(<App />, document.getElementById('contents'))
