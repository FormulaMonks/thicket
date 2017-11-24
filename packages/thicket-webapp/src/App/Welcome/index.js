import React, { Component } from 'react'
import { Button } from 'thicket-elements'
import uuid from 'uuid'
import store from '../../database/store'
import Create from '../../components/Create'
import Onboarding from '../../components/Onboarding'
import CameraAccess from '../../components/CameraAccess'
import './Welcome.css'

const { user, communities } = store
const LOADING = 'checking if the user has been here before'
const ARRIVED = 'first time user'
const ONBOARD = 'quick presentation of what thicket is'
const CAMERA_ACCESS = 'we need to be able to access the camera'
const CREATE = 'user is shooting first gif'
const FINISHED = 'user has finished onboarding'
const TOS = 'user must accept terms of service'
const NEW_COMMUNITY = 'Amazing GIFs'
const NEW_COMMUNITY_ID = uuid()

const Arrived = props => {
  return <div className="welcome__arrived">
    <h2>Welcome to Thicket, a simple web app for creating and sharing GIFs!</h2>
    <Button className={`welcome__start${props.mode === ARRIVED ? '' : ' welcome__start--disabled'}`} disabled={props.mode !== ARRIVED} onClick={props.onContinue}>Create a GIF!</Button>
  </div>
}

class Welcome extends Component{

  state = { mode: LOADING, Tos: null }

  async componentDidMount() {
    const { onboarding } = await user.get()
    if (onboarding === FINISHED) {
      this.props.history.replace('/communities')
    }
    this.setState({ mode: onboarding || ARRIVED })
  }

  render() {
    const { mode } = this.state
    const { nickname } = this.props

    return <div className="welcome">
      {mode === ARRIVED && <Arrived onContinue={() => this.continue(ONBOARD)} mode={mode} />}
      {mode === ONBOARD && <Onboarding onComplete={() => this.continue(TOS)} />}
      {mode === TOS && <this.props.Tos onAccept={() => this.continue(CAMERA_ACCESS)} />}
      {mode === CAMERA_ACCESS && <CameraAccess onGranted={() => this.continue(CREATE)} />}
      {mode === CREATE && <div className="welcome__create">
          <Create nickname={nickname} onSave={this.onSave} />
      </div>}
    </div>
  }

  continue = async mode => {
    if (mode === TOS && !this.props.Tos) {
      mode = CAMERA_ACCESS
    }
    await user.put({ onboarding: mode })
    this.setState({ mode })
  }

  onSave = data =>
    user.put({ onboarding: FINISHED, nickname: data.nickname })
      .then(() => communities.post(NEW_COMMUNITY_ID))
      .then(() => communities.get(NEW_COMMUNITY_ID).then(community => community.put({ title: NEW_COMMUNITY, createdBy: data.nickname })))
      .then(() => communities.get(NEW_COMMUNITY_ID).then(community => community.publications.post(data)))
      .then(() => this.props.history.push(`/c/${NEW_COMMUNITY_ID}/first-gif`))

}

export default Welcome
export { FINISHED }
