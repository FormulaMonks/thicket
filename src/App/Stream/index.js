import React from 'react'
import { Link } from 'react-router-dom'
import './Stream.css'

export default ({ publications: gifs, publicationOrder: order, inactive = false }) => {
  if (!order.length) {
    return <p style={{marginLeft: 15}}>Make a GIF by clicking the camera icon below!</p>
  }

  return <div className="stream__wrapper" style={{ display: inactive && 'none' }}>
    {order.map(id =>
      <Link key={id} to={id}>
        <img alt="" src={gifs[id].src} className="stream__publication"/>
      </Link>
    )}
  </div>
}
