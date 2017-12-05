import React, { Component } from 'react'
import favorite from './favorite.svg'
import './Card.css'
import store from '../../../database/store'

const { communities } = store

class Card extends Component {

  state = { title: '...', createdBy: '...', usage: '' }

  async componentDidMount() {
    const community = await communities.get(this.props.communityId)
    const { title, createdBy } = await community.get()
    this.setState({ title, createdBy: `Created by ${createdBy}` })
  }

  render() {
    const { title, createdBy, usage } = this.state

    return <div className="card">
      <img src={favorite} alt="" className="card__favorite" />
      <div className="card__meta">
        <div>{title}</div>
        <div className="card__extra">
          <div>{createdBy}</div>
          <small>{usage}</small>
        </div>
      </div>
    </div>
  }
}

export default Card
