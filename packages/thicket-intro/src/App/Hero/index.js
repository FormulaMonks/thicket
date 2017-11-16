import React from 'react'
import Nav from './Nav'
import Arrow from '../Arrow'
import './Hero.css'

export default ({ scrollTo }) => (
  <header className="Hero">
    <div className="Hero--PinToTop">
      <Nav />
    </div>
    <div className="Hero--VerticallyCenter">
      <h1>Welcome to Mars!</h1>
      <p>
        Why not make a GIF to share with your Earth friends? We already have
        the <strong>Thicket</strong> app here on the Mars server for you.
      </p>
      <Arrow scrollTo={scrollTo} />
    </div>
  </header>
)
