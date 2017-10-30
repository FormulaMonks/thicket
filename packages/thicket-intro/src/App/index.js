import React from 'react'
//
import Hero from './Hero'
import GifCreator from './GifCreator'
import Filler from './Filler'
import './App.css'

export default () => [
  <Hero key="hero" scrollTo="#create" />,
  <GifCreator key="create" id="create" />,
  <Filler key="1" title="Motivation &amp; Why We Built It" />,
  <Filler key="2" title="How’s Thicket work?" />,
  <Filler key="3" title="Open Source &amp; More Info" />,
  // <ShareYourGif key="share" />,
  // <VisitThicket key="thicket" />,
  // <Footer key="footer" />,
]

