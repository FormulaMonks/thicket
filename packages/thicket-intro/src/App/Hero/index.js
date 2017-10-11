import React from 'react'
import styled, { keyframes } from 'styled-components'
import Nav from './Nav'
import stars from './stars.svg'
import earth from './earth.svg'
import mars from './mars.svg'
import arrow from './arrow.svg'

const Hero = styled.header`
  height: 100vh;
  background-image: url(${mars}), url(${earth}), url(${stars});
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: center bottom, 75% 75%, 100% 100%;
  background-size: 102%, 1em, cover;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const PinToTop = styled.div`
  position: absolute;
  top: 0;
`

// this is vertically centered by virtue of Hero's 'flex'-related properties
const VerticallyCenter = styled.div`
  margin: 0 auto;
  padding: 0 1em;
  max-width: 30em;
  text-align: center;
  h1 {
    margin-top: 0;
  }
`

const bounce = keyframes`
  0%, 62%, 70%, 82%, 100% {
    transform: translateY(0em);
  }
  66% {
    transform: translateY(1em);
  }
  74% {
    transform: translateY(0.5em);
  }
`
const Arrow = styled.img`
  height: 1em;
  animation: ${bounce} 4s infinite;
`

export default ({ scrollTo }) => (
  <Hero>
    <PinToTop>
      <Nav />
    </PinToTop>
    <VerticallyCenter>
      <h1>Welcome to Mars!</h1>
      <p>
        Why not make a GIF to share with your Earth friends? We already have
        the <strong>Thicket</strong> app here on the Mars server for you.
      </p>
      <p>
        <a href={scrollTo}>
          <Arrow src={arrow} alt="next" />
        </a>
      </p>
    </VerticallyCenter>
  </Hero>
)
