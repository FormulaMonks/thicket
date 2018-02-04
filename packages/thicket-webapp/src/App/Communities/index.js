import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import uuid from 'uuid'
import AddButton from '../../components/AddButton'
import './Communities.css'
import store from '../../database/store'
import NoContent from './NoContent'
import Card from './Card'

const { communities } = store

class Communities extends Component {

  state = { data: [] }

  componentDidMount() {
    this.fetch()
    communities.on('update', this.fetch)
    // fix scroll when coming from communities
    window.scrollTo(0, 0)
  }

  componentWillUnmount() {
    communities.off('update', this.fetch)
  }

  render() {
    const { data } = this.state

    return <div className="communities">
      <div className="communities__header">
          <h3 className="communities__title">Your communities</h3>
          <div className="communities__wrap">
            <div className="communities__count">{data.length ? data.length === 1 ? '1 community' : `${data.length} communities` : ''}</div>
            <AddButton onClick={this.onCreateNew} />
          </div>
        </div>
        {data.length
          ? <ul className="communities__list">
          {data.map(communityId => <li key={communityId} className="communities__element">
            <Link to={`/c/${communityId}`} className="communities__link">
              <Card communityId={communityId} />
            </Link>
          </li>)}
        </ul>
          : <NoContent onCreate={this.onCreateNew} />
        }
      </div>
  }

  fetch = async () => {
    const { blacklistedCommunities=[] } = this.props
    const data = await communities.getAll()
    this.setState({ data: data.filter(i => !blacklistedCommunities.includes(i)) })
  }

  onCreateNew = async () => {
    const community = await communities.post(uuid())
    community.put({ createdBy: this.props.nickname })
  }

}

export default Communities
