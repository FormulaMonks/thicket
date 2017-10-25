import React from 'react'
import Camera from './Camera'

import TurnOffWifi from './TurnOffWifi'
import WifiOffExplanation from './WifiOffExplanation'

import './GifCreator.css'

export default class GifCreator extends React.Component {

  state = { online: true, creating: false }

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

  render() {
    const { id } = this.props
    const { online, creating } = this.state

    return (
      <div className="GifCreator" id={id}>
        <div className="GifCreator--Explanation">
          {online
            ? <TurnOffWifi />
            : creating
              ? <Camera />
              : <WifiOffExplanation onActivate={() => this.setState({creating: true})} />
          }
        </div>
      </div>
    )
  }
}
