import React, { Component } from 'react'
import store from '../../../database/store'
import { CommunityCard } from 'thicket-elements'

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

    return <CommunityCard
      title={title}
      createdBy={createdBy}
      usage={usage}
    />
  }
}

export default Card
