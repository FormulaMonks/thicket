import React, { Component } from 'react'
import store from '../../../database/store'
import { CommunityCard } from 'thicket-elements'
import { formatBytes } from '../../../utils/sizeFormat'

const { communities } = store

class Card extends Component {

  state = { title: '...', createdBy: '...', size: '' }

  async componentDidMount() {
    const community = await communities.get(this.props.communityId)
    const { title, createdBy, size } = await community.get()
    this.setState({ title, createdBy: `Created by ${createdBy}`, size })
  }

  render() {
    const { title, createdBy, size } = this.state

    return <CommunityCard
      title={title}
      createdBy={createdBy}
      usage={formatBytes(size)}
    />
  }
}

export default Card
