import React from 'react'
import randomColor from 'randomcolor'
import './UserName.css'

export default ({
  str,
  bgColor=randomColor({ seed: str, luminosity: 'dark' }),
  ...props
}) => <div className="userName__wrap">
  <span
    className="userName__initial"
    style={{ background: bgColor }}
    {...props}
  >
    {str.substr(0, 1)}
  </span>{str}
</div>
