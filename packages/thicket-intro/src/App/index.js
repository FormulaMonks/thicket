import React from 'react'
//
import Hero from './Hero'
import Main from './Main'
import './App.css'

export default () => [
  <Hero key="hero" scrollTo="#main" />,
  <Main key="main" id="main" />,
  // <ShareYourGif key="share" />,
  // <VisitThicket key="thicket" />,
  // <Footer key="footer" />,
]

