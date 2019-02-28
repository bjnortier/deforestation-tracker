import React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

import ProbaVMap from './ProbaVMap2'

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const App = () => <FullScreen><ProbaVMap /></FullScreen>

render(<App />, document.getElementById('contents'))
