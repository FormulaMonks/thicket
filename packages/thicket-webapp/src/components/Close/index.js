import React from 'react'
import x from './x.svg'
import './Close.css'

const Close = props => <button className="close" {...props}>
  <img src={x} alt="Close" />
</button>

export default Close
