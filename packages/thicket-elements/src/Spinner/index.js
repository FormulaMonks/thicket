import React from 'react'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to {transform: rotate(360deg);}
`
const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border-top: 3px solid #000;
  border-right: 2px solid transparent;
  animation: ${spin} 1s linear infinite;
`

export default Spinner
