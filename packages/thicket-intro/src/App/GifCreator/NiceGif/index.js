import React from 'react'
import GifToEarthProgress from './GifToEarthProgress'
import Arrow from '../../Arrow'
import earth from './earth.gif'

const sendingCopy = scrollTo => [
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

const arrivedCopy = () => [
  <h2 key="h2">Your GIF finally made it to Earth!</h2>,
  <p key="p">
    And as luck would have it, this GIF from your Earth friends just arrived to
    you on Mars. Enjoy!
  </p>,
  <p key="img">
    <img src={earth} alt="Earth is better with you on it" />
  </p>,
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
      ...selectCopyFor(arrived)(scrollTo),
    ]
  }
}
