import React from 'react'
import randomColor from 'randomcolor'
import './UserName.css'

export default ({ str, bgColor=randomColor({ seed: str, luminosity: 'dark' }), ...props }) => [
  <span key="initial" className="userName__initial" style={{ background: bgColor }} {...props}>{str.substr(0, 1)}</span>,
  str
]
