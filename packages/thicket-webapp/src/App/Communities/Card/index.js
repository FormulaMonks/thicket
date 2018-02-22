import React, { Component } from 'react'
import store from '../../../database/store'
import { CommunityCard } from 'thicket-elements'
import { formatBytes } from '../../../utils/sizeFormat'

const { communities } = store

class Card extends Component {

  state = { title: '...', createdBy: '...', size: '' }

  async componentDidMount() {
    this.fetch()
    const community = await communities.get(this.props.communityId)
    community.on('update', this.fetch)
  }

  async componentWillUnmount() {
    const community = await communities.get(this.props.communityId)
    community.off('update', this.fetch)
  }

  render() {
    const { title, createdBy, size } = this.state

    return <CommunityCard
      ref={n => this.node = n}
      title={title}
      createdBy={createdBy}
      usage={formatBytes(size)}
      onLeave={this.props.onLeave}
    />
  }

  fetch = async () => {
    const community = await communities.get(this.props.communityId)
    const { title, createdBy='Thicket' } = await community.get()
    // this component can be unmounted before this occurs
    // using the node we avoid calling setState in an unmounted component
    if (this.node) {
      this.setState({ title, createdBy: `Created by ${createdBy}`, size: community.publications.getSize() })
    }
  }

}

export default Card
