import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import uuid from 'uuid'
import { Button } from 'thicket-elements'
import './Communities.css'
import store from '../../database/store'
import NoContent from './NoContent'
import Card from './Card'
import { COMMUNITY_NAMES } from '../../utils/constants'
import Leave from '../../components/Leave'

const { communities } = store

class Communities extends Component {

  state = { data: [], leaving: null, title: '' }

  componentDidMount() {
    this.fetch()
    communities.on('update', this.fetch)
    // fix scroll when coming from community
    window.scrollTo(0, 0)
  }

  componentWillUnmount() {
    communities.off('update', this.fetch)
  }

  render() {
    const { data, leaving, title } = this.state

    if (leaving) {
      return <Leave
        ref={n => this.node = n}
        title={title}
        onLeave={() => this.onLeave(this.state.leaving)}
        onCancel={() => this.setState({ leaving: null })}
      />
    }

    return <div className="communities" ref={n => this.node = n}>
      <div className="communities__header">
          <h3 className="communities__title">Your communities</h3>
          <div className="communities__wrap">
            <div className="communities__count">
              {data.length
                ? data.length === 1
                  ? '1 community'
                  : `${data.length} communities`
                : ''
              }
            </div>
            <Button className="communities__new" onClick={this.onCreateNew}>Create Community</Button>
          </div>
        </div>
        {data.length
          ? <ul className="communities__list">
              {data.map(communityId => <li key={communityId} className="communities__element">
                <Link to={`/c/${communityId}`} className="communities__link">
                  <Card
                    communityId={communityId}
                    onLeave={(e, title) => {
                      e.preventDefault()
                      this.setState({ leaving: communityId, title })
                    }}
                  />
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
    if (this.node) {
      this.setState({ data: data.filter(i => !blacklistedCommunities.includes(i)) })
    }
  }

  onCreateNew = async () => {
    const newId = uuid()
    const community = await communities.post(newId)
    const title = COMMUNITY_NAMES[Math.floor(Math.random() * COMMUNITY_NAMES.length)]
    community.put({ createdBy: this.props.nickname, title })
    this.props.history.replace(`/c/${newId}`)
  }

  onLeave = async communityId => {
    await communities.delete(communityId)
    await this.fetch()
    this.setState({ leaving: null, title: '' })
  }
}

export default Communities