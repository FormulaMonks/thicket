import React from 'react'
import Spinner from 'react-spinkit'
import styled from 'styled-components'

const StyledSpinner = styled(Spinner)`
  color: #26A65B;
`

export default () =>
  <StyledSpinner
    name="ball-pulse-sync"
    fadeIn="none"
  />
