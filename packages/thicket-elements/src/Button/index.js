import React from 'react'
import styled from 'styled-components'

const Styled = styled.button`
  cursor: pointer;
  border: 1px solid #000;
  padding: 20px;
  background: #FFF;
  color: #000;
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
