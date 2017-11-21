import React from 'react'

import Section from '../Section'
import { Button } from '../Buttons'

import wave from './wave.svg'

export default () => (
  <Section
    style={{
      paddingTop: '6.5em',
      paddingBottom: '1em',
      background: `url(${wave}) no-repeat center top`,
      backgroundSize: 'cover',
    }}
  >
    <h2>
      Check out the full Thicket web application to create and share GIFs!
    </h2>
    <Button component="a" href="https://thicket.surge.sh" target="_blank">
      Visit Thicket
    </Button>
  </Section>
)
