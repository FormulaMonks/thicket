import React from 'react'
import styled, { keyframes } from 'styled-components'
import { radialGradient } from '../sharedStyles'

const spin = keyframes`
  to {transform: rotate(360deg);}
`

// via the "backgroundColor" parameter this component can be customized
const bgColor = ({ backgroundColor }) => backgroundColor ? backgroundColor : '#FFF'

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px double transparent;
  border-radius: 50%;
  background-image: linear-gradient(${bgColor}, ${bgColor}), ${radialGradient};
  background-origin: border-box;
  background-clip: content-box,border-box;
  border-top: 2px solid ${bgColor};
  border-right: ${bgColor};
  border-bottom: 2px solid transparent;
  animation: ${spin} 1s linear infinite;
`

export default Spinner
