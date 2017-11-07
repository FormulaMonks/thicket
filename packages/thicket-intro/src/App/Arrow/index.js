import React from 'react'
import arrow from './arrow.svg'
import './Arrow.css'

export default ({ scrollTo }) => (
  <p>
    <a href={scrollTo}>
      <img className="Arrow" src={arrow} alt="next" />
    </a>
  </p>
)
