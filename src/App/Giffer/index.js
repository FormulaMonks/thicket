import React, { Component } from 'react'
import gifshot from 'gifshot'
import ProgressMapper from './ProgressMapper'
import './Giffer.css'
import {
  Accept as AcceptIcon,
  Again as AgainIcon,
  Shoot as ShootIcon,
  Cancel as CancelIcon,
} from '../Icons'
import { GIF_OPTIONS } from './settings'

class Giffer extends Component {

  state = { stream: null, status: 'capture' }

  componentDidMount() {
    this.startVideo()
  }

  componentWillUnmount() {
    this.stopVideo()
    console.log('Video has stopped')
  }

  render() {
    const { status } = this.state
    const { image } = this.props
    const isPreview = status === 'preview'
    const isCapture = status === 'capture'
    const isShoot = status === 'shoot' 
    return <div className="giffer">
      <div className="giffer__content">
        <div className="giffer__preview" style={!isPreview ? { display: 'none' } : {}}>
          <img alt="" ref={img => this.preview = img} src={image} />
        </div>
        <div className="giffer__capture" style={isPreview ? { display: 'none' } : {}}>
          <video ref={v => this.video = v} className="video" autoPlay></video>
        </div>
      </div>
      <div className="giffer__controls">
        <ProgressMapper status={status} />
        <AcceptIcon onClick={this.accept} alt="Accept" style={isPreview ? {} : {display: 'none'}} />
        <AgainIcon onClick={this.again} alt="Again" style={!isPreview ? { display: 'none' } : {}} />
        <ShootIcon onClick={this.capture} alt="Shoot" style={!isCapture ? { display: 'none'} : {}} />
        <CancelIcon onClick={this.cancel} alt="Cancel" style={isShoot ? { display: 'none'} : {}} />
      </div>
    </div>
  }

  startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.video.src = window.URL.createObjectURL(stream)
        this.video.play()
        this.setState({ stream, status: 'capture' })
      })
  }

  stopVideo = () => {
    const video = this.video
    video.pause()
    video.src = ''
    this.state.stream.getTracks().forEach(t => t.stop())
  }

  accept = () => {
    this.props.onSave(this.preview.src)
  }

  again = () => {
    this.removePreview()
    this.setState({ status: 'capture'}, this.capture)
  }

  removePreview = () => {
    this.preview.src = ''
  }

  cancel = () => {
    this.setState({ status: 'capture' })
    this.props.onCancel()
  }

  capture = () => {
    this.setState({ status: 'shoot' }, () => {
      gifshot.createGIF(GIF_OPTIONS, obj => {
        if (obj.error) {
          console.warn('GIFshot error: ', obj.error, obj.errorCode, obj.errorMsg, obj)
          this.setStatus({ status: 'capture' })
          return
        }
        this.preview.src = obj.image
        this.setState({ status: 'preview' })
      })
    })
  }
}

export default Giffer
