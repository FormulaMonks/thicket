import React from 'react'
import './Image.css'

export default ({ alt, ...props }) => (
  <img className="Image" alt={alt} {...props} />
)
