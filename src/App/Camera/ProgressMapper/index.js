import React from 'react'
import Spinner from './Spinner'
import ProgressBar from './ProgressBar'
import { GIF_DURATION } from '../settings'

export default class ProgressMapper extends React.Component {

  state = { value: GIF_DURATION / 1000 }

  componentDidMount() {
    const interval = setInterval(() => {
      this.setState({ value: this.state.value - 0.1 })
      if (this.state.value < 0) {
        clearInterval(interval)
      }
    }, 100)
  }

  render() {
    if (this.state.value < 0) return <Spinner />

    return <ProgressBar percentage={1 - this.state.value / (GIF_DURATION / 1000)} />
  }
}

