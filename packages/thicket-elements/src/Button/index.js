import React from 'react'
import styled from 'styled-components'
import {
  linearGradient,
  defaultBoxShadow,
  hoverBoxShadow,
  activeBoxShadow,
} from '../sharedStyles'

const Styled = styled.button`
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

const Button = props => {
  const { children, ...rest } = props
  return <Styled {...rest}>{children}</Styled>
}

export default Button
