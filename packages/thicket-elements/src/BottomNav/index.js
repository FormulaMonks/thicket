import React from 'react'
import styled from 'styled-components'
import cameraPng from '../../images/camera.png'
import acceptPng from '../../images/accept.png'
import againPng from '../../images/again.png'
import shootPng from '../../images/shoot.png'
import cancelPng from '../../images/cancel.png'
import { Link } from 'react-router-dom'

const Image = styled.img`
  height: 50px;
`

const wrap = png => ({ alt, onClick, ...rest }) =>
  <StyledBottomNav onClick={onClick} {...rest}>
    <Image src={png} alt={alt} />
  </StyledBottomNav>

// requires `onClick` xor `to`
const BottomNav = ({ style = {}, onClick, to, children, alt, className }) =>
  React.createElement(
    onClick ? 'button' : Link,
    {onClick, to, style, className},
    React.cloneElement(children, { alt })
  )

const StyledBottomNav = styled(BottomNav)`
  background: none;
  box-sizing: content-box;
  cursor: pointer;
  height: 60px;
  width: 92px;
  margin: 0;
  padding: 15px;
  border: 1px solid #CCC;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default BottomNav
export const Camera = wrap(cameraPng)
export const Again = wrap(againPng)
export const Accept = wrap(acceptPng)
export const Shoot = wrap(shootPng)
export const Cancel = wrap(cancelPng)
