import React from 'react'
import mars from '../GifCreator/WifiOffExplanation/mars.svg'
import earth from '../../Hero/earth.svg'
import './GifToEarthProgress.css'

const MILLISECONDS_TO_MARS = 3 * 60 * 1000

const getProgress = start => {
  const now = new Date()
  return Math.min((now - start) / MILLISECONDS_TO_MARS, 1)
}

export default class GifToEarthProgress extends React.Component {

  componentDidMount() {
    const { gifCreated } = this.props
    if (gifCreated) this.initProgress()
  }

  componentWillReceiveProps(props) {
    if (props.gifCreated && !this.props.gifCreated) this.initProgress()
  }

  initProgress = () => {
    var progress = getProgress(this.props.gifCreated)
    document.documentElement.style.setProperty(
      '--progress',
      progress * 100 + '%'
    )
    document.documentElement.style.setProperty(
      '--timeToComplete',
      (1 - progress) * 180 + 's'
    )
  }

  render() {
    const { gif, gifCreated } = this.props

    if (!gifCreated || !gif) return null

    console.log({gif, gifCreated})

    return (
      <div className="GifToEarthProgress">
        <img src={mars} alt="mars" className="mars" />
        <div className="GifToEarthProgress--progressBars">
          <div className="gif terran">
            ?
          </div>
          <div className="progress fromEarth"><div /></div>
          <div className="progress fromMars"><div /></div>
          <div className="gif martian">
            <img src={gif} alt="your GIF" />
          </div>
        </div>
        <img src={earth} alt="earth" className="earth"  />
      </div>
    )
  }
}
