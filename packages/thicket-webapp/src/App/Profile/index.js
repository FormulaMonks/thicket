import React, { Component } from 'react'
import store from '../../database/store'
import { Button, Input } from 'thicket-elements'
import './Profile.css'

class Profile extends Component {
  render() {
    return <div className="profile">
      <h2>Change your Thicket nickname</h2>
      <div>Thicket creates a default guest nickname for you as soon as you visit the web app. You can change your nickname below.</div>
      <h3>You can update with your own nickname below.</h3>
      <form className="profile__form" onSubmit={this.onSubmit} ref={f => (this.form = f)}>
        <Input className="profile__input" name="nickname" defaultValue={this.props.nickname} />
        <div className="profile__buttons">
          <Button className="profile__save" type="submit">Save Changes</Button>
          <Button secondary type="button" onClick={this.close}>Cancel</Button>
        </div>
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
