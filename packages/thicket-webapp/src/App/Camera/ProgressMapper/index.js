import React from 'react'
import { Spinner } from 'thicket-elements'
import ProgressBar from './ProgressBar'
import { GIF_DURATION } from '../settings'

export default class ProgressMapper extends React.Component {

  state = { value: GIF_DURATION }

  componentDidMount() {
    const interval = setInterval(() => {
      this.setState({ value: this.state.value - 100 })
      if (this.state.value < 0) {
        clearInterval(interval)
      }
    }, 100)
  }

  render() {
    if (this.state.value < 0) return <Spinner />

    return <ProgressBar percentage={ 1 - this.state.value / GIF_DURATION } />
  }
}

