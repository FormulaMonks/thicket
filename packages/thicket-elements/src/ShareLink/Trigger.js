import React from 'react'
import styled, { css } from 'styled-components'

const Wrap = styled.div`
  display: inline-block;
  position: relative;

  ${props => props.active && css`
    &:before {
      border-bottom: 10px solid rgba(8, 19, 31, 0.5);
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      content: ' ';
      position: absolute;
      top: 100%;
      left: calc(50% - 10px);
    }
    &:after {
      border-bottom: 9px solid white;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      content: ' ';
      position: absolute;
      top: calc(100% + 2px);
      left: calc(50% - 9px);
      z-index: 2;
    }
  `}
`

export default ({active, children}) =>
  <Wrap active={active}>{children}</Wrap>
