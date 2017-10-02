import React, { Component } from 'react'
import Spinner from '../Spinner'
import db from '../syncedDB'
import './Stream.css'

class Stream extends Component {

  state = { publications: {}, publicationOrder: [], loaded: false }

  componentDidMount() {
    db.fetchData()
      .then(data => this.setState({ loaded: true, ...data }))
      .catch(err => console.warn(`Error fetching stream data: ${err}`))
  }

  render() {
    const {
      publications: gifs,
      publicationOrder: order,
      loaded,
    } = this.state

    if (!loaded) {
      return <div className="stream__spinner"><Spinner /></div>
    }

    if (!order.length) {
      return <p style={{marginLeft: 15}}>Make a GIF by clicking the camera icon below!</p>
    }

    return <div className="stream__wrapper">
        {order.map(id =>
          <img key={id} alt="" src={gifs[id].src} className="stream__publication"/>
        )}
      </div>
  }
}

export default Stream
