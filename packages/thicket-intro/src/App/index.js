import React from 'react'
import { injectGlobal } from 'styled-components'
//
import Hero from './Hero'

injectGlobal`
  body {
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,
      Arial,sans-serif;
    font-weight: 300;
    font-size: calc(.85em + 1vw);
    line-height: 1.5em;
    margin: 0;
    padding: 0;
  }
`

export default () => [
  <Hero key="hero" scrollTo="#thicket" />,
]

