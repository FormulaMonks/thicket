import React, { Component } from 'react'
import gifshot from 'gifshot'
import styled from 'styled-components'
import Controls from './Controls'
import Progress from './Progress'
import Loading from './Loading'
import Review from './Review'
import { GIF_DURATION, GIF_OPTIONS } from './settings'
import changeSvg from './change.svg'

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const Vid = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  line-height: 0;
`
const Change = styled.button`
  position: absolute;
  background: transparent;
  top: 1em;
  right: 1em;
  z-index: 2;
  border: none;
  padding: 0;
  margin: 0;
  /* odd, without this the image is not rendered */
  border:1px solid transparent;
`
const ChangeImg = styled.img`
  height: 40px;
  display: block;
`
const videoStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}
const isMobile = /Mobi/.test(navigator.userAgent)

// modes
const STANDBY = 'awaiting further instruction'
const SHOOTING = 'capturing video'
const LOADING = 'processing gif'
const REVIEW = 'review, possibly save gif'
const USER_CAMERA = 'user'
const ENVIRONMENT_CAMERA = 'environment'

export default class Camera extends Component {

  state = { stream: null, mode: STANDBY, gif: null, camera: USER_CAMERA }

  componentDidMount() {
    this.startVideo()
  }

  componentWillUnmount() {
    if (this.state.mode === STANDBY || this.state.mode === SHOOTING) {
      this.stopVideo()
    }
  }

  render() {
    const { mode } = this.state
    const { classNames = {} } = this.props
    const { cameraWrap = null, videoWrap = null, ...classes = {} } = classNames
    return <Wrap className={cameraWrap}>
      {(mode === STANDBY || mode === SHOOTING) &&
        <Vid key="video" className={videoWrap}>
          <video
            ref={v => this.video = v}
            autoPlay
            playsInline
            style={videoStyles}
          />
        </Vid>
      }
      {isMobile && mode === STANDBY &&
        <Change onClick={this.onChangeCamera}>
          <ChangeImg src={changeSvg} alt="Change camera" />
        </Change>
      }
      {mode === STANDBY && <Controls classNames={classes} key="controls" onClick={this.capture} />}
      {mode === SHOOTING && <Progress classNames={classes} key="progress" />}
      {mode === LOADING && <Loading classNames={classes} key="loading" />}
      {mode === REVIEW && <Review classNames={classes} key="review" src={this.state.gif} redo={this.again} approve={() => this.props.onSave(this.state.gif)} />}
    </Wrap>
  }

  again = () => {
    this.setState({ stream: null })
    this.startVideo()
    this.setState({ mode: STANDBY })
  }

  capture = () => {
    const { onShooting=()=>{} } = this.props
    if (this.state.stream) {
      onShooting(true)
      setTimeout(() => {
        this.stopVideo()
        this.setState({ mode: LOADING })
        onShooting(false)
      }, GIF_DURATION + 500);
      this.setState({ mode: SHOOTING }, () => {
        gifshot.createGIF({
          ...GIF_OPTIONS,
          webcamVideoElement: this.video,
          cameraStream: this.state.stream,
        }, obj => {
          if (obj.error) {
            console.warn('GIFshot error: ', obj.error, obj.errorCode, obj.errorMsg, obj)
            this.setState({ mode: STANDBY })
            return
          }
          this.setState({ gif: obj.image}, this.onCaptured)
        })
      })
    }
  }

  onCaptured = () => {
    if (this.props.review) {
      this.setState({ mode: REVIEW })
      return
    }
    this.props.onSave(this.state.gif)
  }

  onChangeCamera = () => {
    this.setState(
      {
        camera: this.state.camera === USER_CAMERA
          ? ENVIRONMENT_CAMERA
          : USER_CAMERA
      },
      () => {
        this.stopVideo()
        this.startVideo()
      }
    )
  }

  startVideo = async () => {
    const constraints = isMobile
      ? { video: { facingMode: { exact: this.state.camera } } }
      : { video: true }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    this.video.srcObject = stream
    await this.video.play()
    this.setState({ stream })
  }

  stopVideo = () => {
    const video = this.video
    if (video) {
      video.pause()
      video.src = ''
    }
    this.state.stream && this.state.stream.getTracks && this.state.stream.getTracks().forEach(t => t.stop())
  }

}
