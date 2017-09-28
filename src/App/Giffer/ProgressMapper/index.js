import React from 'react'
import Spinner from './Spinner'
import ProgressBar from './ProgressBar'
import { GIF_DURATION } from '../settings'

export default class ProgressMapper extends React.Component {

  state = { value: 0 }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'shoot') {
        const interval = setInterval(() => {
          const newValue = (this.state.value - 0.1).toFixed(1)
          this.setState({ value: newValue })
          if (this.state.value < 0){
            clearInterval(interval)
          }
        }, 100)
    }
    this.setState({ value: GIF_DURATION / 1000 })
  }

  render() {
    if (this.props.status === 'shoot') {
      if (this.state.value < 0) return <Spinner />

      return <ProgressBar percentage={1 - this.state.value / (GIF_DURATION / 1000)} />
    }
    return null
  }
}

