import React, { Component } from 'react'
import Camera from 'thicket-camera'
import Customize from './Customize'
import CameraAccess from '../CameraAccess'
import arrowSvg from './back.svg'
import './CreateGif.css'

const ACCESS = 'request access to the camera'
const CAMERA = 'user is interacting with the camera process'
const CUSTOMIZE = 'add metadata to the gif (username and label)'

class CreateGif extends Component {

  state = { mode: ACCESS, src: null, caption: '', nickname: '' }

  componentDidMount() {
    document.querySelector('body').style.overflow = 'hidden'
  }

  componentWillUnmount() {
    document.querySelector('body').style.overflow = 'auto'
  }

  render() {
    const { onCancel } = this.props
    const { mode } = this.state
    return [
      mode === ACCESS && <CameraAccess
        key="access"
        onGranted={() => this.setState({ mode: CAMERA })}
      />,
      mode === CAMERA && [
        <button
          onClick={onCancel}
          className="createGif__back"><img alt="Back" src={arrowSvg} />Back
        </button>,
        <Camera
          key="camera"
          onSave={src => this.setState({ src, mode: CUSTOMIZE})}
          classNames={{
            cameraWrap: 'createGif',
            controlsWrap: 'createGif__wrap',
            controlsTitle: 'createGif__controlsTitle',
            controlsButton: 'createGif__controlsButton',
            progressBarWrap: 'createGif__progressBarWrap',
            progressBarBar: 'createGif__progressBarBar',
            progressLabel: 'createGif__progressLabel',
            reviewWrap: 'createGif__reviewWrap',
            reviewPreview: 'createGif__reviewPreview',
            reviewControlsWrap: 'createGif__reviewControlsWrap',
            reviewApprove: 'createGif__reviewApprove',
          }}
          onShooting={this.props.onShooting}
        />,
      ],
      mode === CUSTOMIZE && <Customize
        key="customizing"
        onSubmit={this.props.onSave}
        nickname={this.props.nickname}
        src={this.state.src}
        onRetake={this.reset}
        onCancel={this.props.onCancel}
      />,
    ]
  }

  reset = () => {
    this.setState({ src: null, caption: '', nickname: '', mode: CAMERA })
  }
}

export default CreateGif
