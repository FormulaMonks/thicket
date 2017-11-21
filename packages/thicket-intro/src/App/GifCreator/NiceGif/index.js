import React from 'react'
import GifToEarthProgress from './GifToEarthProgress'
import Arrow from '../../Arrow'
import Image from '../Image'
import { Button } from '../../Buttons'

import earth from '../../Hero/earth.svg'

const sendingCopy = ({ scrollTo }) => [
  <h2 key="h2">Nice GIF! We here on Mars love it.</h2>,
  <p key="p">
    With traditional apps, your fellow Martians would have to wait until it
    makes a round-trip to an Earth server. With Thicket, we get it right away.
    We’re sending your GIF off to your Earth friends now; they’ll get it as
    fast as lightspeed allows.
  </p>,
  <p key="p2">
    <small>Learn more about Thicket while you’re waiting.</small>
  </p>,
  <Arrow key="p3" scrollTo={scrollTo} />,
]

const arrivedCopy = ({ gif }) => [
  <Image key="earth" alt="" src={earth} />,
  <h2 key="h2">Your GIF finally made it to Earth from Mars!</h2>,
  <p key="p">
    Thanks for trying out this quick Thicket simulation.
  </p>,
  <img key="gif" alt="your GIF" src={gif} />,
  <p key="p2">
    <small>To create more GIFs and share them, head over to Thicket.</small>
    <Button component="a" href="https://thicket.surge.sh" target="_blank">
      Visit Thicket
    </Button>
  </p>,
]

const selectCopyFor = arrived => arrived ? arrivedCopy : sendingCopy

export default class NiceGif extends React.Component {

  state = { arrived: false }

  setArrived = () => {
    this.props.onArrival()
    this.setState({ arrived: true })
  }

  render() {
    const { id, gif, gifCreated, scrollTo } = this.props
    const { arrived } = this.state
    return [
      <GifToEarthProgress
        key="loader"
        id={id}
        gif={gif}
        gifCreated={gifCreated}
        setArrived={this.setArrived}
        arrived={arrived}
      />,
      ...selectCopyFor(arrived)({ scrollTo, gif }),
    ]
  }
}
