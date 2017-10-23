import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  width: 400px;
  height: 20px;
  border-left: 2px solid #CCC;
  border-right: 2px solid #CCC;
  display: flex;
  align-items: center;
`

const Bar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #4DAF7C;
  border-radius: 2px;
  transform-origin: left;
`

export default ({ percentage }) =>
  <Wrap>
    <Bar style={{transform: `scaleX(${percentage})`}} />
  </Wrap>

