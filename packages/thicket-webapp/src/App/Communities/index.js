import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import uuid from 'uuid'
import Modal from '../../components/Modal'
import { Button, Input } from 'thicket-elements'
import './Communities.css'
import store from '../../database/store'
import Add from './Add'
import Card from './Card'

const { communities } = store

class New extends Component {

  state = { title: '' }

  render() {
    return <Modal
      header={<div>Create New Community</div>}
      footer={[
        <Button key="cancel" onClick={this.props.onCancel}>Cancel</Button>,
        <Button key="save" onClick={() => this.props.onSave(this.state.title)}>Save</Button>
      ]}
      onClose={this.props.onCancel}>
      <div>Give your new Community a title:</div>
      <Input onChange={e => this.setState({ title: e.currentTarget.value })} />
    </Modal>
  }
}

class Communities extends Component {

  state = { data: [], creating: false }

  componentDidMount() {
    this.fetch()
    communities.on('update', this.fetch)
  }

  componentWillUnmount() {
    communities.off('update', this.fetch)
  }

  render() {
    const { data, creating } = this.state

    return [
      <div className="communities" key="communities">
        <div className="communities__header">Your communities</div>
        <ul className="communities__grid" key="grid">
          <li key="new" className="communities__element">
            <Add onClick={() => this.setState({ creating: true })} />
          </li>
          {data.map(communityId => <li key={communityId} className="communities__element">
            <Link to={`/c/${communityId}`} className="communities__link">
              <Card communityId={communityId} />
            </Link>
          </li>)}
        </ul>
      </div>,
      creating && <div className="communities__create" key="create">
        <New onCancel={() => this.setState({ mode: null })} onSave={this.onSave} />
      </div>,
    ]
  }

  fetch = async () => {
    const data = await communities.getAll()
    this.setState({ data })
  }

  onSave = async title => {
    const newId = uuid()
    const community = await communities.post(newId)
    community.post({ title, createdBy: this.props.nickname })
    this.setState({ creating: false })
  }
}

export default Communities
