import React from 'react'
import mars from '../../WifiOffExplanation/mars.svg'
import earth from '../../../Hero/earth.svg'
import './GifToEarthProgress.css'

const MILLISECONDS_TO_MARS = 3 * 60 * 1000

const getProgress = start => {
  const now = new Date()
  return Math.min((now - start) / MILLISECONDS_TO_MARS, 1)
}

export default class GifToEarthProgress extends React.Component {
  state = { progress: null }

  componentDidMount() {
    const { gifCreated } = this.props
    const gifArrivesAtEarth = new Date(gifCreated.getTime() + 3000 * 60)
    const now = new Date()

    this.setState({ progress: getProgress(gifCreated) })

    if (gifArrivesAtEarth > now) {
      const interval = window.setInterval(
        () => {
          const progress = getProgress(gifCreated)
          this.setState({ progress })
          if (progress === 1) window.clearInterval(interval)
        },
        200
      )
    }
  }

  render() {
    const { gif } = this.props
    const { progress } = this.state

    return (
      <div className="GifToEarthProgress">
        <img src={mars} alt="mars" className="mars" />
        <div className="GifToEarthProgress--progressBars">
          <div className="gif martian" style={{ left: `${progress * 100}%` }}>
            <img src={gif} alt="your GIF" />
          </div>
          <div className="gif terran" style={{ right: `${progress * 100}%` }}>
            ?
          </div>
          <progress value={progress} className="fromEarth" />
          <progress value={progress} className="fromMars" />
        </div>
        <img src={earth} alt="earth" className="earth"  />
      </div>
    )
  }
}
