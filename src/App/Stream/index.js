import React from 'react'
import db from '../syncedDB'
import './Stream.css'

export default () => {
  const {
    publications: gifs,
    publicationOrder: order,
  } = db.fetchData()

  if (!order.length) {
    return <p style={{marginLeft: 15}}>Make a GIF by clicking the camera icon below!</p>
  }

  return order.map(id =>
    <img key={id} alt="" src={gifs[id].src} className="stream__publication"/>
  )
}
