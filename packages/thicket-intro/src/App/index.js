import React from 'react'
import { injectGlobal } from 'styled-components'
//
import { dark } from './colors'
import Hero from './Hero'
import GifCreator from './GifCreator'

injectGlobal`
  body {
    background-color: ${dark};
    color: white;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,
      Arial,sans-serif;
    font-weight: 300;
    font-size: calc(.85em + 1vw);
    line-height: 1.5em;
    margin: 0;
    padding: 0;
  }
  h1, h2 {
    font-weight: 300;
  }
`

export default () => [
  <Hero key="hero" scrollTo="#create" />,
  <div key="create" id="create">
    <GifCreator />
  </div>,
]

