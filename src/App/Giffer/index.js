import React, { Component } from 'react'
import gifshot from 'gifshot'
import classname from 'classname'
import ProgressMapper from './ProgressMapper'
import './styles.css'
import acceptIcon from './accept.png'
import againIcon from './again.png'
import shootIcon from './shoot.png'
import cancelIcon from './cancel.png'
import { GIF_OPTIONS } from './settings'

class Giffer extends Component {

  state = { stream: null, status: '' }

  componentDidMount() {
    this.startVideo()
  }

  render() {
    const { status } = this.state
    const previewWrapperStyles = classname('preview-wrapper', { 'preview-wrapper-active': status === 'preview'  })
    const captureWrapperStyles = classname('capture-wrapper', { 'capture-wrapper-active': status !== 'preview' })
    const shootBtnStyles = classname('shoot giffer-btns', { 'giffer-btns-active': status === 'capture' })
    const acceptBtnStyles = classname('accept giffer-btns', { 'giffer-btns-active': status === 'preview'})
    const againBtnStyles = classname('again giffer-btns', { 'giffer-btns-active': status === 'preview'})
    const cancelBtnStyles = classname('cancel giffer-btns', { 'giffer-btns-active': status !== 'shoot'})
    return <div className="wrapper">
      <div className="giffer-content">
        <div className={previewWrapperStyles}>
          <div className="preview">
            <img alt="" ref={img => this.preview = img} />
          </div>
        </div>
        <div className={captureWrapperStyles}>
          <div className="input">
            <video ref={v => this.video = v} className="video" autoPlay></video>
          </div>
        </div>
      </div>
      <div className="giffer-controls">
        <ProgressMapper status={status} />
        <div className={acceptBtnStyles} onClick={this.accept}>
          <img alt="Accept" src={acceptIcon} className="accept-icon" />
        </div>
        <div className={againBtnStyles} onClick={this.again}>
          <img alt="Again" src={againIcon} className="again-icon" />
        </div>
        <div className={shootBtnStyles} onClick={this.capture}>
          <img alt="Shoot" src={shootIcon} className="shoot-icon" />
        </div>
        <div className={cancelBtnStyles} onClick={this.props.onCancel}>
          <img alt="Cancel" src={cancelIcon} className="cancel-icon" />
        </div>
      </div>
    </div>
  }

  startVideo = () => {
    if (this.state.status !== 'capture') {
      const video = this.video
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.src = window.URL.createObjectURL(stream)
          video.play()
          this.setState({ stream, status: 'capture' })
        })
    }
  }

  stopVideo = () => {
    const video = this.video
    video.pause()
    video.src = ''
    this.state.stream.getTracks().forEach(t => t.stop())
  }

  accept = () => {
    // todo
    // I heard this urban legend of how instagram started uploading the user
    // pics while they presented the user with the filters section, this way
    // the whole process took less time (asynch upload), maybe we can do
    // something similar. I mean, while we wait for the user to accept the GIF
    // we could already be uploading it - although in reality we do not upload
    // anything, but send it to the service workers to save to local storage.
    // Or not and we just do syncrhonous process.
  }

  again = () => {
    this.removePreview()
    this.startVideo()
  }

  removePreview = () => {
    this.preview.src = ''
  }

  capture = () => {
    this.setState({ status: 'shoot' }, () => {
      gifshot.createGIF(GIF_OPTIONS, obj => {
        if (obj.error) {
          console.warn('GIFshot error: ', obj.error, obj.errorCode, obj.errorMsg, obj)
          this.setStatus({ status: 'capture' })
          return
        }
        this.stopVideo()
        this.preview.src = obj.image
        this.setState({ status: 'preview' })
      })
    })
  }
}

export default Giffer
