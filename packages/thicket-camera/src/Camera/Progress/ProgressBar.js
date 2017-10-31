import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
`

const Bar = styled.div`
  margin-bottom: 50px;
  width: 100%;
  height: 50px;
  background-color: #777;
  transform-origin: left;
`

export default ({ percentage }) =>
  <Wrap>
    <Bar style={{transform: `scaleX(${percentage})`}} />
  </Wrap>

