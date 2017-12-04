import React from 'react'
import styled from 'styled-components'
import {
  linearGradient,
  defaultBoxShadow,
  activeBoxShadow,
} from '../sharedStyles'

const Styled = styled.button`
  background: ${linearGradient};
  box-shadow: ${defaultBoxShadow};
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: inherit;
  padding: 1em 3em;

  &:focus, &:hover {
    box-shadow: ${defaultBoxShadow}, inset 0 0 0 99em rgba(0,0,0,0.1);
  }

  &:active {
    box-shadow: ${activeBoxShadow}
  }
`

const Button = props => {
  const { children, ...rest } = props
  return <Styled {...rest}>{children}</Styled>
}

export default Button
