import React from 'react'

export default ({percentage}) =>
  <div className="bar-wrapper">
    <div
      className="bar"
      style={{transform: `scaleX(${percentage})`}}
    />
  </div>

