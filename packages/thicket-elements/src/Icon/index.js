import React from 'react'
import styled from 'styled-components'
import { linearGradient } from '../sharedStyles'
import ReactSVG from 'react-svg'

const getSize = ({ size = 50 }) => `${size}px`
const getHalfSize = ({ size = 50 }) => `${size / 2}px`

const Icon = styled.div`
  background-image: ${linearGradient};
  border-radius: 50%;
  display: inline-block;
  height: ${getSize};
  width: ${getSize};
  padding: 1px;

  & div{
    border-radius: 50%;
    height: 100%;
    width: 100%;
    background: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .svg{
    height: ${getHalfSize};
    width: ${getHalfSize};
  }

  &:hover div{
    background: ${linearGradient};
  }
  &:hover path{
    fill: #FFF;
  }
`

export default ({ src, size }) => <Icon size={size}>
  <div>
    <ReactSVG path={src} className="svg" />
  </div>
</Icon>
