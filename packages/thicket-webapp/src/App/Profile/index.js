import React, { Component } from 'react'
import store from '../../database/store'
import { Button } from 'thicket-elements'
import './Profile.css'

class Profile extends Component {
  render() {
    return <div className="profile">
      <h2>Change your Thicket nickname</h2>
      <div>You can update with your own nickname below.</div>
      <form onSubmit={this.onSubmit} ref={f => (this.form = f)}>
        <input type="text" name="nickname" defaultValue={this.props.nickname} />
        <Button type="button" onClick={this.close}>Cancel</Button>
        <Button type="submit">Save</Button>
      </form>
    </div>
  }

  close = () => {
    const { history } = this.props
    if (history.length > 2) {
      history.goBack()
    }
    history.push('/')
  }

  onSubmit = e => {
    e.preventDefault()
    store.user.put({ nickname: this.form.elements.nickname.value })
    this.close()
  }

}

export default Profile
