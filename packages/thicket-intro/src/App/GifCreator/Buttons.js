import React from 'react'
import styled from 'styled-components'

import { dark } from '../colors'

export const Button = styled.button`
  background-color: transparent;
  border: 1px solid white;
  color: white;
  font-size: 1em;
  margin: 1em;
  padding: 0.5em 2.5em;
`

const GreyTooltipButton = styled(Button)`
  border: 1px solid darkgrey;
  color: darkgrey;
  position: relative;
  z-index: 2;
  &:before, &:after {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
  &:before {
    position: absolute;
    padding: 0.5em 0;
    width: 100%;
    background-color: ${dark};
    border: 1px solid white;
    content: '${props => props.tip}';
    color: white;

    margin-top: 10px;
    top: 100%;
    left: 0;
  }
  &:after {
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    width: 0;
    border-bottom: 10px solid white;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    content: " ";
    font-size: 0;
    line-height: 0;
  }
  &:hover {
    &:before, &:after {
      visibility: visible;
      opacity: 1;
    }
  }
`

export const DisabledButton = ({ tip, children}) => (
  <GreyTooltipButton disabled tip={tip}>
    {children}
  </GreyTooltipButton>
)

