import React, { Component } from 'react'
import { Button, Spinner } from 'thicket-elements'
import DetectRTC from 'detectrtc'
import './CameraAccess.css'
import cameraSvg from './camera.svg'

class CameraAccess extends Component {

  state = { accepted: false, rejected: false, loading: true }

  componentDidMount() {
    DetectRTC.load(() =>
      this.setState(
        {
          loading: false,
          accepted: DetectRTC.isWebsiteHasWebcamPermissions
        },
        () => {
          if (this.state.accepted) {
            this.props.onGranted()
          }
        }
      ))
  }

  render() {
    if (this.state.rejected) {
      return <div className="cameraAccess">
        <h2>To begin creating GIFs please grant us access to your camera.</h2>
      </div>
    }

    if (this.state.loading) {
      return <div className="cameraAccess"><Spinner /></div>
    }

    return <div className="cameraAccess">
      <img src={cameraSvg} alt="Camera" />
      <h2>Thicket is going to need to access your camera to begin creating GIFs.</h2>
      <Button onClick={this.requestAccess}>Enable Camera Access</Button>
    </div>
  }

  requestAccess = () =>
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(this.props.onGranted)
      .catch(() => this.setState({ rejected: true }))

}

export default CameraAccess
