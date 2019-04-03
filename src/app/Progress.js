import React from 'react'
import styled, { keyframes } from 'styled-components'

const pan = keyframes`
  from {
    transform: translate(0%, 0);
  }
  to {
    transform: translate(100%, 0);
  }
`

const Progress = styled.div`
  animation: ${pan} 2s linear infinite;
  height: 3px;
  z-index: 1;
  position: fixed;
  background-color: #188c0a;
  top: 0;
  left: 0;
  right: 0;
`

export default () => <Progress />
