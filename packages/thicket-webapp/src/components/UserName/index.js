import React from 'react'
import randomColor from 'randomcolor'
import './UserName.css'

export default ({
  str,
  bgColor=randomColor({ seed: str, luminosity: 'dark' }),
  ...props
}) => <div
  data-test="username-wrap"
  className="userName__wrap"
>
  <span
    data-test="username-initial"
    className="userName__initial"
    style={{ background: bgColor }}
    {...props}
  >
    {str.substr(0, 1)}
  </span>{str}
</div>
