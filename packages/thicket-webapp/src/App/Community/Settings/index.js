import React, { Component } from 'react'
import Modal from '../../../components/Modal'
import { Button } from 'thicket-elements'
import localForage from 'localforage'
import db from '../../../database'

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = { title: props.title }
  }

  render() {
    return <Modal
      header={<div>Community Settings</div>}
      footer={<Button onClick={this.props.onClose}>Close</Button>}>
      <input onChange={e => this.setState({ title: e.currentTarget.value })} value={this.state.title} />
      <Button onClick={this.onSave}>Save</Button>
      <Button onClick={this.onLeave}>Leave Community</Button>
    </Modal>
  }

  onLeave = () => {
    db.community(this.props.communityId).delete()
      .then(() => localForage.getItem('communities'))
      .then(data => localForage.setItem('communities', data.filter(c => c !== this.props.communityId)))
      .then(() => this.props.history.replace('/communities'))
  }

  onSave = () => {
    db.community(this.props.communityId).put({ title: this.state.title })
  }
}

export default Settings
