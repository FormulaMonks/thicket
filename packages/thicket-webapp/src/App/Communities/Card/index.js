import React, { Component } from 'react'
import placeholder from './placeholder.png'
import './Card.css'

class Card extends Component {
  render() {
    return <img src={placeholder} alt="" className="card__img" />
  }
}

export default Card
