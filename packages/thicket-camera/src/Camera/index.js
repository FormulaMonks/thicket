import React, { Component } from 'react'
import gifshot from 'gifshot'
import styled from 'styled-components'
import ProgressMapper from './ProgressMapper'
import { BottomNav as Nav } from 'thicket-elements'
import { GIF_DURATION, GIF_OPTIONS } from './settings'

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #FFF;
`

const Content = styled.div`
  flex: 1;
  padding: 15px;
  display: flex;
  justify-content: center;
`

const Controls = styled.div`
  height: 120px;
  border-top: 1px solid #CCC;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`

// modes
const STANDBY = 'awaiting further instruction'
const SHOOTING = 'capturing and processing video'
const REVIEW = 'review, possibly save gif'

export default class Camera extends Component {

  state = { stream: null, mode: STANDBY }

  componentDidMount() {
    this.startVideo()
  }

  componentWillUnmount() {
    this.stopVideo()
  }

  render() {
    const { mode } = this.state
    return <Wrap>
      <Content>
        <div style={{ display: mode === REVIEW && 'none' }}>
          <video
            ref={v => this.video = v}
            style={{width: GIF_OPTIONS.gifWidth, height: GIF_OPTIONS.gifHeight}}
            autoPlay
          />
        </div>
        <div style={{ display: mode !== REVIEW && 'none' }}>
          <img alt="" ref={img => this.preview = img} />
        </div>
      </Content>
      <Controls>
        {mode === STANDBY && [
          <Nav.Shoot key="shoot" onClick={this.capture} alt="Shoot" />,
        ]}
        {mode === SHOOTING && <ProgressMapper />}
        {mode === REVIEW && [
          <Nav.Accept key="accept" onClick={this.accept} alt="Accept" />,
          <Nav.Again key="again" onClick={this.again} alt="Again" />,
        ]}
      </Controls>
    </Wrap>
  }

  startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.video.src = window.URL.createObjectURL(stream)
        this.video.play()
        this.setState({ stream, mode: STANDBY })
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
    this.startVideo()
    this.removePreview()
    this.setState({ mode: STANDBY})
  }

  removePreview = () => {
    this.preview.src = ''
  }

  capture = () => {
    setTimeout(this.stopVideo, GIF_DURATION + 500);
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
        this.preview.src = obj.image
        this.setState({ mode: REVIEW })
      })
    })
  }
}
