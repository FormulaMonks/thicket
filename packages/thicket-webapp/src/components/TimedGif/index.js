import React, { Component } from 'react'
import { PLACEHOLDER, TIMEOUT } from '../../utils/constants'
import errorSvg from './error.svg'
import { Spinner } from 'thicket-elements'
import PlayableGif from '../PlayableGif'
import './TimedGif.css'

export default class TimedGif extends Component {
  constructor(props) {
    super(props)
    const { src } = props
    this.state = {
      src,
      interval: null,
      loading: src ? false : true
    }
  }

  componentDidMount() {
    const interval = setTimeout(() => {
      this.setState({ loading: false })
    }, TIMEOUT)
    this.setState({ interval })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  componentWillReceiveProps({ src, caption }) {
    if (src) {
      clearInterval(this.state.interval)
      this.setState({ loading: false })
    }
    this.setState({ src })
  }

  render() {
    const {
      alt,
      className,
      controlable,
      autoPlay,
      onClick=()=>{},
    } = this.props
    const { loading, src } = this.state
    return [
      src
        ? <PlayableGif
            key="playableGif"
            src={src}
            alt={alt}
            className={className}
            controlable={controlable}
            autoPlay={autoPlay}
            onClick={onClick}
          />
        : <img
            key="placeholderGif"
            src={PLACEHOLDER}
            alt={alt}
            className={className}
          />,
      loading &&
        <div
          key="loading"
          className="timedGif__wrap"
        >
          <Spinner backgroundColor="#09131D" />
        </div>,
      !loading && !src &&
        <div
          key="error"
          className="timedGif__wrap"
        >
          <img src={errorSvg} alt="Could not display GIF" /><br />
          We’re sorry,<br />
          Could not display GIF
      </div>
    ]
  }
}
