import React, { Component } from 'react'
import styled from 'styled-components'
import ProgressBar from './ProgressBar'
import { GIF_DURATION } from '../settings'

const Label = styled.div`
  text-transform: uppercase;
  position: absolute;
  bottom: 50px;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
`

export default class Progress extends Component {

  state = { value: GIF_DURATION }

  componentDidMount() {
    const interval = setInterval(() => {
      this.setState({ value: this.state.value - 50 })
      if (this.state.value < 0) {
        clearInterval(interval)
      }
    }, 50)
  }

  render() {
    const value = Math.max(0, this.state.value)
    const { progressLabel, ...classes } = this.props.classNames
    return [
      <ProgressBar classNames={classes} key="progress" percentage={ 1 - value / GIF_DURATION } />,
      <Label className={progressLabel} key="label">Recording GIF</Label>,
    ]
  }
}

