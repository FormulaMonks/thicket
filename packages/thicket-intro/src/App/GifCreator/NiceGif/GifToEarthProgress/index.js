import React from 'react'
import mars from '../../WifiOffExplanation/mars.svg'
import earth from '../../../Hero/earth.svg'
import './GifToEarthProgress.css'

const MILLISECONDS_TO_MARS = 3 * 60 * 1000

const getProgress = start => {
  const now = new Date()
  return Math.min((now - start) / MILLISECONDS_TO_MARS, 1)
}

let lastKnownScrollPosition = 0
let ticking = false

const Sending = ({ gif }) => (
  <div>
    <img src={mars} alt="mars" className="mars" />
    <div className="GifToEarthProgress--progressBars">
      <div className="progress fromMars"><div /></div>
      <div className="gif">
        <img src={gif} alt="your GIF" />
      </div>
    </div>
    <img src={earth} alt="earth" className="earth"  />
  </div>
)

const Arrived = ({ onClick, scrollTo }) => (
  <div className="arrived">
    <img src={mars} alt="mars" className="mars" />
    <span>
      Success, interplanetary GIFs exchanged!{' '} <a href={scrollTo} onClick={onClick}>Check it out!</a>
    </span>
    <img src={earth} alt="earth" className="earth"  />
  </div>
)

export default class GifToEarthProgress extends React.Component {

  state = { showBanner: true }

  componentDidMount() {
    var progress = getProgress(this.props.gifCreated);
    document.documentElement.style.setProperty(
      '--progress',
      progress * 100 + '%'
    )
    document.documentElement.style.setProperty(
      '--timeToComplete',
      (1 - progress) * 180 + 's'
    )

    this.adjustOffset()

    setTimeout(this.setArrived, (1 - progress) * 180 * 1000)

    window.addEventListener('scroll', this.optimize(this.maybeStick))
    window.addEventListener('resize', this.optimize(this.adjustOffset))
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.optimize(this.maybeStick))
    window.removeEventListener('resize', this.optimize(this.adjustOffset))
  }

  optimize = func => () => {
    lastKnownScrollPosition = window.scrollY
    if (!ticking) {
      window.requestAnimationFrame(() => {
        func(lastKnownScrollPosition)
        ticking = false
      })
    }
    ticking = true
  }

  maybeStick = scrollPosition => {
    if (!this.wrap) return;
    if (scrollPosition > this.offset) {
      this.wrap.className = "GifToEarthProgress sticky"
    } else {
      this.wrap.className = "GifToEarthProgress"
    }
  }

  adjustOffset = () => {
    if (!this.wrap) return;
    this.offset = this.wrap.parentElement.offsetTop
  }

  setArrived = () => {
    this.props.setArrived()
    setTimeout(
      this.adjustOffset,
      500 // wait for image to load; TODO: come up with a better way to do this
    )
  }

  stopShowingBanner = () => { this.setState({ showBanner: false }) }

  render() {
    const { id, gif, arrived } = this.props

    if (!this.state.showBanner) return null

    return (
      <div ref={div => this.wrap = div} className="GifToEarthProgress">
        {arrived
          ? <Arrived scrollTo={`#${id}`} onClick={this.stopShowingBanner} />
          : <Sending gif={gif} />
        }
      </div>
    )
  }
}
