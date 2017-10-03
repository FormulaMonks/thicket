import React from 'react'
import './ProgressBar.css'

export default ({ percentage }) =>
  <div className="progressbar">
    <div
      className="progressbar__bar"
      style={{transform: `scaleX(${percentage})`}}
    />
  </div>

