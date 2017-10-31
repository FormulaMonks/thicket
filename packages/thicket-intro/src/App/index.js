import React from 'react'
//
import Hero from './Hero'
import GifCreator from './GifCreator'
import Why from './Why'
import What from './What'
import Filler from './Filler'
import './App.css'

export default () => [
  <Hero key="hero" scrollTo="#create" />,
  <GifCreator key="create" id="create" scrollTo="#why" />,
  <Why key="why" id="why" />,
  <Filler key="2" title="How’s Thicket work?" />,
  <What key="what" />,
  // <ShareYourGif key="share" />,
  // <VisitThicket key="thicket" />,
  // <Footer key="footer" />,
]

