import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import uuid from 'uuid'
import { Modal, Button, Input } from 'thicket-elements'
import AddButton from '../../components/AddButton'
import './Communities.css'
import store from '../../database/store'
import NoContent from './NoContent'
import Card from './Card'

const { communities } = store

class Communities extends Component {

  state = { data: [], creating: false }

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
    const { data, creating } = this.state

    return [
      (!creating || document.documentElement.clientWidth > 600) &&
        <div key="communities" className="communities">
          <div className="communities__header">
            <h3 className="communities__title">Your communities</h3>
            <div className="communities__wrap">
              <div className="communities__count">{data.length ? data.length === 1 ? '1 community' : `${data.length} communities` : ''}</div>
              <AddButton onClick={() => this.setState({ creating: true })} />
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
            : <NoContent onCreate={() => this.onCreateNew({ newId: uuid(), createdBy: this.props.nickname})} />
          }
        </div>,
      creating && <Modal key="modal" disableBodyScroll className="communities__new">
        <h3 className="communities__title">Create New Community</h3>
        <h4 className="communities__message">Exciting to see you’re creating a new Community on Thicket!</h4>
        <form className="communities__form" ref={f => this.form = f} onSubmit={this.onSubmit}>
          <Input placeholder="Community Title" name="title" />
          <div className="communities__buttons">
            <div className="communities__button communities__button--primary">
              <Button type="submit">Create Community</Button>
            </div>
            <Button
              secondary
              type="button"
              className="communities__button--secondary"
              onClick={() => this.setState({ creating: false })}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>,
    ]
  }

  fetch = async () => {
    const data = await communities.getAll()
    this.setState({ data })
  }

  onSubmit =  e => {
    e.preventDefault()
    this.onCreateNew({
      newId: uuid(),
      title: this.form.elements.title.value,
      createdBy: this.props.nickname
    })
    this.setState({ creating: false })
  }

  onCreateNew = async ({ newId, ...data }) => {
    const community = await communities.post(newId)
    community.post({ ...data })
  }

}

export default Communities
