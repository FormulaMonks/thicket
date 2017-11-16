import React from 'react'
import Camera from 'thicket-camera'

import TurnOffWifi from './TurnOffWifi'
import WifiOffExplanation from './WifiOffExplanation'
import NiceGif from './NiceGif'

import './GifCreator.css'

export default class GifCreator extends React.Component {

  state = (() => {
    const gifCreated = window.localStorage.getItem('gifCreated')
    return {
      online: window.navigator.onLine,
      creating: false,
      gif: window.localStorage.getItem('gif'),
      gifCreated: gifCreated && new Date(Number(gifCreated)),
    }
  })()

  componentDidMount() {
    window.addEventListener('online', this.goOnline, false)
    window.addEventListener('offline', this.goOffline, false)
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
