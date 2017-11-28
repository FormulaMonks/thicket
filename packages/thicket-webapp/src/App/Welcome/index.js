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
const NEW_COMMUNITY = 'Amazing GIFs'
const NEW_COMMUNITY_ID = uuid()

const Arrived = props => {
  return <div className="welcome__arrived">
    <h2>Welcome to Thicket, a simple web app for creating and sharing GIFs!</h2>
    <Button className={`welcome__start${props.mode === ARRIVED ? '' : ' welcome__start--disabled'}`} disabled={props.mode !== ARRIVED} onClick={props.onContinue}>Create a GIF!</Button>
  </div>
}

class Welcome extends Component{
  
  state = { mode: LOADING }

  componentDidMount() {
    user.get()
      .then(({ onboarding }) => {
        if (onboarding === FINISHED) {
          this.props.history.replace('/communities')
        }
        this.setState({ mode: onboarding || ARRIVED })
      })
  }
  
  render() {
    const { mode } = this.state
    const { nickname } = this.props

    return <div className="welcome">
      {mode === ARRIVED && <Arrived onContinue={() => this.continue(ONBOARD)} mode={mode} />}
      {mode === ONBOARD && <Onboarding onComplete={() => this.continue(CAMERA_ACCESS)} />}
      {mode === CAMERA_ACCESS && <CameraAccess onGranted={() => this.continue(CREATE)} />}
      {mode === CREATE && <div className="welcome__create">
          <Create nickname={nickname} onSave={this.onSave} />
      </div>}
    </div>
  }

  continue = mode =>
    user.put({ onboarding: mode }).then(() => this.setState({ mode }))

  onSave = async data => {
    user.put({ onboarding: FINISHED, nickname: data.nickname })
    const community = await communities.post(NEW_COMMUNITY_ID)
    community.put({ title: NEW_COMMUNITY, createdBy: data.nickname })
    community.publications.post(data)
    this.props.history.push(`/c/${NEW_COMMUNITY_ID}/first-gif`)
  }

}

export default Welcome
export { FINISHED }
