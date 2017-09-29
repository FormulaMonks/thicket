import React from 'react'
import cameraPng from './camera.png'
import acceptPng from './accept.png'
import againPng from './again.png'
import shootPng from './shoot.png'
import cancelPng from './cancel.png'
import './Icons.css'

const iconify = png => ({ alt, onClick, ...rest }) =>
  <Icon onClick={onClick} {...rest}>
    <img className="icon__img" src={png} alt={alt} />
  </Icon>

const Icon = ({ style = {}, onClick, children, alt }) =>
  <div className="icon" onClick={onClick} style={style}>
    {React.cloneElement(children, { alt })}
  </div>

export default Icon
export const Camera = iconify(cameraPng)
export const Again = iconify(againPng)
export const Accept = iconify(acceptPng)
export const Shoot = iconify(shootPng)
export const Cancel = iconify(cancelPng)
