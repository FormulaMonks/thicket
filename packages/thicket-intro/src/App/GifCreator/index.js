import React from 'react'
import Camera from 'thicket-camera'

import TurnOffWifi from './TurnOffWifi'
import WifiOffExplanation from './WifiOffExplanation'
import NiceGif from './NiceGif'

import './GifCreator.css'

const ONE_DAY_AGO = new Date((new Date()) - 24 * 60 * 60 * 1000)

export default class GifCreator extends React.Component {

  state = {
    online: window.navigator.onLine,
    creating: false,
    gif: null,
    gifCreated: null,
  }

  componentDidMount() {
    window.addEventListener('online', this.goOnline, false)
    window.addEventListener('offline', this.goOffline, false)

    const gif = window.localStorage.getItem('gif')
    let gifCreated = window.localStorage.getItem('gifCreated')
    if (gifCreated) gifCreated = new Date(Number(gifCreated))

    if (gifCreated < ONE_DAY_AGO) {
      window.localStorage.removeItem('gif')
      window.localStorage.removeItem('gifCreated')
    } else {
      this.setState({ gif, gifCreated })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.goOnline, false)
    window.removeEventListener('offline', this.goOffline, false)
  }

  goOnline = () => this.setState({ online: true, creating: false })
  goOffline = () => this.setState({ online: false })

  startCreating = () => this.setState({creating: true})

  setGif = gif => {
    window.localStorage.setItem('gif', gif)
    const gifCreated = new Date()
    window.localStorage.setItem('gifCreated', gifCreated.getTime())
    this.setState({ gif, gifCreated, creating: false })
  }

  setArrived = () => this.setState({ arrived: true })

  render() {
    const { id, scrollTo } = this.props
    const { gif, gifCreated, online, creating, arrived } = this.state

    return (
      <div id={id} className={`GifCreator${arrived ? ' arrived' : ''}`}>
        <div className="GifCreator--Explanation">
          {gif
            ? <NiceGif
                id={id}
                gif={gif}
                gifCreated={gifCreated}
                scrollTo={scrollTo}
                onArrival={this.setArrived}
              />
            : online
              ? <TurnOffWifi />
              : creating
                ? <Camera onSave={this.setGif}/>
                : <WifiOffExplanation onActivate={this.startCreating} />
        }
        </div>
      </div>
    )
  }
}
