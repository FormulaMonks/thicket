import React, { Component } from 'react'
import GifPlayer from 'react-gif-player'
import 'react-gif-player/dist/gifplayer.css'
import VisibilitySensor from 'react-visibility-sensor'
import './PlayableGif.css'

export default class PlayableGif extends Component {

  state = { isPlaying: true }

  render() {
    const {
      alt,
      src,
      className,
      controlable=false,
      autoPlay=true,
    } = this.props
    const { isPlaying } = this.state

    if (!controlable) {
      return <img
        src={src}
        alt={alt}
        className={className}
      />
    }

    return <VisibilitySensor
      className="playableGif"
      onChange={this.onVisibilityChange}
      partialVisibility={true}
    >
      <div
        className={`playableGif${isPlaying ? '' : ' playableGif--paused'}`}
      >
        <GifPlayer
          gif={src}
          alt={alt}
          className={className}
          autoplay={autoPlay}
          pauseRef={r => this.pause = r}
          onChange={this.onChange}
        />
        <button
          onClick={this.props.onClick}
          className={`playableGif__link${isPlaying ? ' playableGif__link--active' : ''}`}
        >
          {alt}
        </button>
      </div>
    </VisibilitySensor>
  }

  onChange = isPlaying => {
    this.setState({ isPlaying })
  }

  onVisibilityChange = isVisible => {
    if (!isVisible) {
      this.setState({ isPlaying: false }, this.pause)
    }
  }
}
