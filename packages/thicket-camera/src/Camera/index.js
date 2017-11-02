import React, { Component } from 'react'
import gifshot from 'gifshot'
import styled from 'styled-components'
import Controls from './Controls'
import Progress from './Progress'
import Loading from './Loading'
import Review from './Review'
import { GIF_DURATION, GIF_OPTIONS } from './settings'

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
`
const videoStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

// modes
const STANDBY = 'awaiting further instruction'
const SHOOTING = 'capturing video'
const LOADING = 'processing gif'
const REVIEW = 'review, possibly save gif'

export default class Camera extends Component {

  state = { stream: null, mode: STANDBY, gif: null }

  componentDidMount() {
    this.startVideo()
  }

  componentWillUnmount() {
    if (this.state.mode === STANDBY || SHOOTING) {
      this.stopVideo()
    }
  }

  render() {
    const { mode } = this.state
    return <Wrap>
      {(mode === STANDBY || mode === SHOOTING) && 
        <video key="video" ref={v => this.video = v} autoPlay style={videoStyles} />
      }
      {mode === STANDBY && <Controls key="controls" onClick={this.capture} />}
      {mode === SHOOTING && <Progress key="progress" />}
      {mode === LOADING && <Loading key="loading" />}
      {mode === REVIEW && <Review key="review" src={this.state.gif} redo={this.again} approve={this.props.onSave} />}
    </Wrap>
  }

  again = () => {
    this.startVideo()
    this.setState({ mode: STANDBY })
  }
  
  capture = () => {
    setTimeout(() => {
      this.stopVideo()
      this.setState({ mode: LOADING })
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
        this.setState({ mode: REVIEW, gif: obj.image })
      })
    })
  }

  startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.video.src = window.URL.createObjectURL(stream)
        this.video.play()
        this.setState({ stream  })
      })
  }

  stopVideo = () => {
    const video = this.video
    video.pause()
    video.src = ''
    this.state.stream.getTracks().forEach(t => t.stop())
  }

}
