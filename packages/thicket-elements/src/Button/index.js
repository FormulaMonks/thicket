import React from 'react'
import styled from 'styled-components'

const defaultBoxShadow = '0px 2px 2px rgba(113, 114, 215, 0.34), 0px 0px 2px rgba(113, 114, 215, 0.22)'

const Styled = styled.button`
  background: linear-gradient(23deg, #F7618B, #2A7AFF 140%);
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
    box-shadow: 0px 0px 8px rgba(113, 114, 215, 0.32),
      inset 0 0 0 99em rgba(255, 255, 255, 0.05);
  }
`

const Button = props => {
  const { children, ...rest } = props
  return <Styled {...rest}>{children}</Styled>
}

export default Button
