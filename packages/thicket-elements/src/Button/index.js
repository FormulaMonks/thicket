import React from 'react'
import styled from 'styled-components'

const Styled = styled.button`
  background: #FFF;
  border: 1px solid #000;
  color: #000;
  cursor: pointer;
  padding: 20px;
  width: 50%;

  &:hover{
    background: #000;
    color: #FFF;
  }
`

const Button = props => {
  const { children, ...rest } = props
  return <Styled {...rest}>{children}</Styled>
}

export default Button
