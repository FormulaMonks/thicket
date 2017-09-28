import React, { Component } from 'react'
import classname from 'classname'
import Giffer from './Giffer'
import './App.css'
import cameraIcon from './camera.png'

class App extends Component {

  state = { status: '' }

  render() {
    const { status } = this.state
    let giffer = null
    if (status === 'shoot') {
      giffer = <Giffer onCancel={() => this.setState({ status: '' })} />
    }
    const footerStyles = classname('footer', { 'footer-active': status !== 'shoot' })
    return (
      <div className="app">
        <div className="header">Thicket</div>
        <div className="content">
          <div className="stream-wrapper">User feed</div>
          <div className={classname('giffer-wrapper', { 'giffer-wrapper-active': status === 'shoot' })}>{giffer}</div>
        </div>
        <div className={footerStyles}>
          <div className="camera-icon-wrapper" onClick={() => this.setState({ status: 'shoot' })}>
            <img className="camera-icon" src={cameraIcon} alt="New GIF" />
          </div>
        </div>
      </div>
    )
  }
}

export default App
