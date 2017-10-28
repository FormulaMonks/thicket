import React from 'react'
import Camera from 'thicket-camera'

import TurnOffWifi from './TurnOffWifi'
import WifiOffExplanation from './WifiOffExplanation'
import NiceGif from './NiceGif'

import './GifCreator.css'

export default class GifCreator extends React.Component {

  state = {
    online: true,
    creating: false,
  }

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
    this.setState(
      { creating: false },
      () => this.props.setGif(gif)
    )
  }

  render() {
    const { gif } = this.props
    const { online, creating } = this.state

    return (
      <div className="GifCreator">
        <div className="GifCreator--Explanation">
          {gif
            ? <NiceGif />
            : !online
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
