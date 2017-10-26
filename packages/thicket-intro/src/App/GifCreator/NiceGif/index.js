import React from 'react'
import GifToEarthProgress from './GifToEarthProgress'

export default ({ gif, gifCreated }) => [
  <GifToEarthProgress key="img" gif={gif} gifCreated={gifCreated} />,
  <h2 key="h2">Nice GIF! It's on its way back to Earth now.</h2>,
  <p key="p">
    Because of how Thicket works, we here on Mars <strong>can already see your
    GIF</strong>. No round-trip to an Earth-bound server necessary! Your
    friends on Earth will get it as fast as the pesky speed of light allows.
  </p>,
  <p key="p2">
    And hey! It looks like they just sent you something, too! Stick around to
    find out what it is.
  </p>,
]
