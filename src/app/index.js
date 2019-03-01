import React from 'react'
import { render } from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import styledNormalize from 'styled-normalize'

import Site from './Site'

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

// const MapContainer = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 200px;
// `


render(<div><GlobalStyle /><Site id='KNP' /></div>, document.getElementById('contents'))
