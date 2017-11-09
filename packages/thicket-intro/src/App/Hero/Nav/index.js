import React from 'react'
import citrusbyte from './citrusbyte.svg'
import './Nav.css'

export default () => (
  <nav className="Nav">
    <a className="logo" href="https://citrusbyte.com">
      <img src={citrusbyte} alt="Citrusbyte" style={{ height: '1.5em' }} />
    </a>
    <ul>
      <li><a href="https://citrusbyte.com/portfolio">Work</a></li>
      <li><a href="https://citrusbyte.com/our-approach">What We Do</a></li>
      <li><a href="https://citrusbyte.com/about-us">Who We Are</a></li>
      <li><a href="https://citrusbyte.com/contact-us">Contact</a></li>
    </ul>
  </nav>
)
