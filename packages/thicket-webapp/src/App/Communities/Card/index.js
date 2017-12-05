import React, { Component } from 'react'
import favorite from './favorite.svg'
import './Card.css'

class Card extends Component {
  render() {
    return <div className="card">
      <img src={favorite} alt="" className="card__favorite" />
      <div className="card__meta">
        <div className="card__title">Community Title</div>
        <div className="card__extra">
          <div>Created by username</div>
          <div className="card__usage">disk usage</div>
        </div>
      </div>
    </div>
  }
}

export default Card
