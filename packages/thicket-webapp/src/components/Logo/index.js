import React from 'react'
import icon from './icon.svg'
import text from './thicket-text.svg'
import './Logo.css'

export default () =>
  <div className="Logo">
    <img alt="" src={icon} className="Logo-icon" />
    <img alt="THICKET" src={text} className="Logo-text" />
  </div>
