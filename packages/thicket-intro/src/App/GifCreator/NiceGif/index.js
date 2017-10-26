import React from 'react'

import Image from '../Image'

export default ({ gif }) => [
  <Image key="img" src={gif} alt="" />,
  <h2 key="h2">Nice GIF!</h2>,
  <p key="p">
    Once you go back online, your GIF can start its three minute journey back
    to your friends on Earth!
  </p>,
]
