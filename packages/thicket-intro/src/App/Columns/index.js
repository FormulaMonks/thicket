import React from 'react'
import './Columns.css'

export default ({ children, style }) => (
  <div className="Columns" style={style}>
    {children}
  </div>
)
