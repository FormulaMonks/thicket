import React from 'react'
import GifToEarthProgress from './GifToEarthProgress'
import Arrow from '../../Arrow'
import Image from '../Image'

import earth from '../../Hero/earth.svg'
import download from './download.svg'
import link from './link.svg'
import facebook from './facebook.svg'
import twitter from './twitter.svg'

import './NiceGif.css'

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
  <h2 key="h2">Your GIF finally made it to Earth!</h2>,
  <p key="p">
    View your GIF below and share it with your friends!
  </p>,
  <img key="gif" alt="your GIF" src={gif} />,
  <p key="p2"><small>Share this GIF! <em>(Turn WiFi back on)</em></small></p>,
  <div key="share" className="NiceGif--share">
    <button onClick={() => alert('todo')}>
      <img alt="download" src={download} />
    </button>
    <button onClick={() => alert('todo')}>
      <img alt="copy link" src={link} />
    </button>
    <button onClick={() => alert('todo')}>
      <img alt="share on facebook" src={facebook} />
    </button>
    <button onClick={() => alert('todo')}>
      <img alt="tweet" src={twitter} />
    </button>
  </div>,
]

const selectCopyFor = arrived => arrived ? arrivedCopy : sendingCopy

export default class NiceGif extends React.Component {

  state = { arrived: false }

  setArrived = () => this.setState({ arrived: true })

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
