import React from 'react'
import cameraPng from './camera.png'
import acceptPng from './accept.png'
import againPng from './again.png'
import shootPng from './shoot.png'
import cancelPng from './cancel.png'
import './NavLinks.css'
import { Link } from 'react-router-dom'

const navLinkify = png => ({ alt, onClick, ...rest }) =>
  <NavLink onClick={onClick} {...rest}>
    <img className="icon__img" src={png} alt={alt} />
  </NavLink>

// requires `onClick` xor `to`
const NavLink = ({ style = {}, onClick, to, children, alt }) =>
  React.createElement(
    onClick ? 'button' : Link,
    {onClick, to, style, className: 'icon'},
    React.cloneElement(children, { alt })
  )

export default NavLink
export const Camera = navLinkify(cameraPng)
export const Again = navLinkify(againPng)
export const Accept = navLinkify(acceptPng)
export const Shoot = navLinkify(shootPng)
export const Cancel = navLinkify(cancelPng)
