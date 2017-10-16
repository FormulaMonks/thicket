import React from 'react'

import Image from '../Image'
import { DisabledButton } from '../Buttons'
import noWifi from './no-wifi.svg'

export default () => [
  <Image key="img" src={noWifi} alt="" />,
  <h2 key="h2">Let's get started. Turn off that WiFi!</h2>,
  <p key="p">
    Before we can begin, please turn off your WiFi connection. This may
    sound crazy, but Thicket is actually built around the idea of Offline
    First. Once you turn off your connection, click the button below.
  </p>,
  <DisabledButton key="button" tip="🙅 📶">Create GIF</DisabledButton>,
]
