import React from 'react'
import GifToEarthProgress from './GifToEarthProgress'
import Arrow from '../../Arrow'

export default ({ gif, gifCreated, scrollTo }) => [
  <GifToEarthProgress key="img" gif={gif} gifCreated={gifCreated} />,
  <h2 key="h2">Nice GIF! We here on Mars love it.</h2>,
  <p key="p">
    With traditional apps, your fellow Martians would have to wait until it
    makes a round-trip to an Earth server. With Thicket, we get it right away.
    Your Earth friends will get it as fast as lightspeed allows.
  </p>,
  <p key="p2">
    And <em>maybe</em> an Earth friend just sent you something, too!
    {' '}<em>Maybe</em> if you stick around for three minutes, you'll find out
    what it is!
  </p>,
  <Arrow key="p3" scrollTo={scrollTo} />,
]
