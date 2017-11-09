import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import localForage from 'localforage'
import uuid from 'uuid'
import Modal from '../../components/Modal'
import { Button } from 'thicket-elements'
import db from '../../database'
import './Communities.css'
import placeholder from './placeholder.png'
import add from './add.svg'

const CREATE = 'user is creating a community'

class New extends Component {

  state = { title: '' }

  render() {
    return <Modal
      header={<div>Create New Community</div>}
      main={[
        <div key="title">Give your new Community a title:</div>,
        <input key="value" type="text" onChange={e => this.setState({ title: e.currentTarget.value })} />
      ]}
      footer={[
        <Button key="cancel" onClick={this.props.onCancel}>Cancel</Button>,
        <Button key="save" onClick={() => this.props.onSave(this.state.title)}>Save</Button>
      ]}
      onClose={this.props.onCancel}
    />
  }
}

class Communities extends Component {

  state = { data: [], mode: null }

  componentDidMount() {
    localForage.getItem('communities').then(data => this.setState({ data: data || [] }))
  }

  render() {
    const { data, mode } = this.state

    return [
      <div className="communities" key="communities">
        <div className="communities__header">Your communities</div>
        <ul className="communities__grid" key="grid">
          <li key="new" className="communities__element">
            <button onClick={() => this.setState({ mode: CREATE })} className="communities__btnNew">
              <img src={add} alt="Create New Community" />
               Create New Community
            </button>
          </li>
          {data.map(item => <li key={item} className="communities__element">
            <Link to={`/c/${item}`} className="communities__link">
              <img src={placeholder} alt="" className="communities__img" />
            </Link>
          </li>)}
        </ul>
      </div>,
      mode === CREATE && <div className="communities__create" key="create">
        <New onCancel={() => this.setState({ mode: null })} onSave={this.onSave} />
      </div>,
    ]
  }

  onSave = title => {
    const newId = uuid()
    db.community(newId).post({ title, createdBy: this.props.nickname })
      .then(() => localForage.setItem('communities', this.state.data.concat(newId)))
      .then(() => this.setState({ mode: null, data: this.state.data.concat(newId) }))
  }
}

export default Communities
