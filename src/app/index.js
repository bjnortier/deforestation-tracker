import React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const App = () => <FullScreen>Hello World!</FullScreen>

render(<App />, document.getElementById('contents'))
