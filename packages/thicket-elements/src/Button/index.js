import React from 'react'
import styled from 'styled-components'
import {
  linearGradient,
  defaultBoxShadow,
  hoverBoxShadow,
  activeBoxShadow,
} from '../sharedStyles'

const Button = styled.button`
  background: ${linearGradient};
  box-shadow: ${defaultBoxShadow};
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  padding: 1em 3em;

  &:focus, &:hover {
    box-shadow: ${hoverBoxShadow};
  }

  &:active {
    box-shadow: ${activeBoxShadow}
  }
`

const Secondary = styled(Button)`
  background: transparent;
  background: inherit;
  border: 1px solid #F3638D;
  border-image: ${linearGradient} 1;
  color: inherit;
  padding: calc(1em - 1px) calc(3em - 1px);

  &:focus, &:hover, &:active {
    background: ${linearGradient};
    padding: 1em 3em;
    border-width: 0;
    color: white;
  }
`

export default props => {
  const { children, secondary, ...rest } = props
  const Component = secondary ? Secondary : Button
  return <Component {...rest}>{children}</Component>
}
