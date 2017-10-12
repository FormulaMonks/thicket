import React from 'react'
import styled from 'styled-components'
import Spinner from 'react-spinkit'

const StyledSpinner = styled(Spinner)`
  color: #26A65B;
`

export default () => (
  <StyledSpinner
    name="ball-pulse-sync"
    fadeIn="none"
    className="spinner"
  />
)
