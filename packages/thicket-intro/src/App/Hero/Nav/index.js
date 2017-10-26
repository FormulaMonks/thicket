import React from 'react'
import citrusbyte from './citrusbyte.svg'
import './Nav.css'

export default () => (
  <nav className="Nav">
    <a href="https://citrusbyte.com">
      <img src={citrusbyte} alt="Citrusbyte" style={{ height: '1.5em' }} />
    </a>
  </nav>
)
