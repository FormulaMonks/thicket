import React, { Component } from 'react'
import Camera from 'thicket-camera'
import Customize from './Customize'

const CAMERA = 'user is interacting with the camera process'
const CUSTOMIZE = 'add metadata to the gif (username and label)'

class CreateGif extends Component {

  state = { mode: CAMERA, src: null, caption: '', nickname: '' }

  render() {
    const { mode } = this.state
    return [
      mode === CAMERA && <Camera key="camera" onSave={src => this.setState({ src, mode: CUSTOMIZE})} />,
      mode === CUSTOMIZE && <Customize key="customizing" onSubmit={this.props.onSave} nickname={this.props.nickname} src={this.state.src} onCancel={this.reset} />,
    ]
  }

  reset = () => {
    this.setState({ src: null, caption: '', nickname: '', mode: CAMERA })
  }
}

export default CreateGif
