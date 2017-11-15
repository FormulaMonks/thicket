import React, { Component } from 'react'
import Modal from '../../../components/Modal'
import { Button } from 'thicket-elements'
import store from '../../../database/store'

const { communities } = store

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = { title: props.title }
  }

  render() {
    return <Modal
      header={<div>Community Settings</div>}
      footer={<Button onClick={this.props.onClose}>Close</Button>}
      onClose={this.props.onClose}>
      <input onChange={e => this.setState({ title: e.currentTarget.value })} value={this.state.title} />
      <Button onClick={this.onSave}>Save</Button>
      <Button onClick={this.onLeave}>Leave Community</Button>
    </Modal>
  }

  onLeave = () =>
    communities.delete(this.props.communityId)
      .then(() => this.props.history.replace('/communities'))

  onSave = () =>
    communities.get(this.props.communityId).then(community => community.put({ title: this.state.title }))

}

export default Settings
