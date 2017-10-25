import React from 'react'
//
import Hero from './Hero'
import GifCreator from './GifCreator'
import './App.css'

export default () => [
  <Hero key="hero" scrollTo="#create" />,
  <GifCreator key="create" id="create" />,
]

