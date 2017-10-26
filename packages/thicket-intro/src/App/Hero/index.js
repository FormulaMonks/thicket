import React from 'react'
import Nav from './Nav'
import stars from './stars.svg'
import earth from './earth.svg'
import mars from './mars.svg'
import arrow from './arrow.svg'
import './Hero.css'

export default ({ scrollTo }) => (
  <header className="Hero" style={{
    backgroundImage: `url(${mars}), url(${earth}), url(${stars})`,
    backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
    backgroundPosition: 'center bottom, 75% 75%, 100% 100%',
    backgroundSize: '102%, 1em, cover',
  }}>
    <div className="Hero--PinToTop">
      <Nav />
    </div>
    <div className="Hero--VerticallyCenter">
      <h1>Welcome to Mars!</h1>
      <p>
        Why not make a GIF to share with your Earth friends? We already have
        the <strong>Thicket</strong> app here on the Mars server for you.
      </p>
      <p>
        <a href={scrollTo}>
          <img className="Hero--Arrow" src={arrow} alt="next" />
        </a>
      </p>
    </div>
  </header>
)
