import React from 'react'
import styled from 'styled-components'
import { linearGradient } from '../sharedStyles'
import ReactSVG from 'react-svg'

const getSize = ({ size = 50 }) => `${size}px`
const getIconSize = ({ iconSize = 25 }) => `${iconSize}px`

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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .svg{
    height: ${getIconSize};
    width: ${getIconSize};
  }

  &:hover div{
    background: ${linearGradient};
  }
  &:hover path{
    fill: #FFF;
  }
`

export default ({ src, bgColor='#FFF', ...props }) => <Icon {...props}>
  <div style={{ backgroundColor: bgColor }}>
    <ReactSVG path={src} className="svg" />
  </div>
</Icon>
