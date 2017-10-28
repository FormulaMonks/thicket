import React from 'react'
import GifToEarthProgress from './GifToEarthProgress'
import GifCreator from './GifCreator'
import Filler from './Filler'
import './Main.css'

export default class Main extends React.Component {
  state = (() => {
    const gifCreated = window.localStorage.getItem('gifCreated')
    return {
      gif: window.localStorage.getItem('gif'),
      gifCreated: gifCreated && new Date(Number(gifCreated)),
    }
  })()

  setGif = gif => {
    window.localStorage.setItem('gif', gif)
    const gifCreated = new Date()
    window.localStorage.setItem('gifCreated', gifCreated.getTime())
    this.setState({ gif, gifCreated })
  }


  render() {
    const { id } = this.props
    const { gif, gifCreated } = this.state

    return (
      <main id={id} className="Main">
        <GifToEarthProgress gifCreated={gifCreated} gif={gif} />
        <GifCreator gif={gif} setGif={this.setGif} />
        <Filler title="Motivation &amp; Why We Built It" />
        <Filler title="How’s Thicket work?" />
        <Filler title="Open Source &amp; More Info" />
      </main>
    )
  }
}
