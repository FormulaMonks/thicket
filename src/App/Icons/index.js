import React from 'react'
import cameraPng from './camera.png'
import acceptPng from './accept.png'
import againPng from './again.png'
import shootPng from './shoot.png'
import cancelPng from './cancel.png'
import './Icons.css'
import { Link } from 'react-router-dom'

const iconify = png => ({ alt, onClick, ...rest }) =>
  <Icon onClick={onClick} {...rest}>
    <img className="icon__img" src={png} alt={alt} />
  </Icon>

// requires `onClick` xor `to`
// todo: rename; not an icon, but is a navigational component
const Icon = ({ style = {}, onClick, to, children, alt }) =>
  React.createElement(
    onClick ? 'button' : Link,
    {onClick, to, style, className: 'icon'},
    React.cloneElement(children, { alt })
  )

export default Icon
export const Camera = iconify(cameraPng)
export const Again = iconify(againPng)
export const Accept = iconify(acceptPng)
export const Shoot = iconify(shootPng)
export const Cancel = iconify(cancelPng)
