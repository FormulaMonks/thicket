import React from 'react'

import Image from '../Image'
import { Button } from '../Buttons'
import mars from './mars.svg'

export default () => [
  <Image key="img" src={mars} alt="" />,
  <h2 key="h2">Being on Mars means being offline. Forever.</h2>,
  <p key="p">
    When Mars and Earth are at their closest, light (radio waves, text
    messages, GIFs) takes a whopping <strong>3 minutes</strong> to go from
    one to the other. Thicket is a new kind of app that works around such
    problems.
  </p>,
  <Button key="button">Create GIF</Button>,
]
