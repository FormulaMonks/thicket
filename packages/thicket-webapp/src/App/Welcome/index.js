import React, { Component } from 'react'
import { Button } from 'thicket-elements'
import Create from '../../components/Create'
import Onboarding from '../../components/Onboarding'
import CameraAccess from '../../components/CameraAccess'
import './Welcome.css'
import {
  ARRIVED,
  ONBOARD,
  CAMERA_ACCESS,
  CREATE,
  COMPLETE,
  updateOnboarding,
  addCommunity,
} from '../../database/localDB'
import { updateCommunity, addPublication } from '../../database/syncedDB'

const NEW_COMMUNITY = 'Amazing GIFs'

const Arrived = props => {
  return <div className="welcome__arrived">
    <h2>Welcome to Thicket, a simple web app for creating and sharing GIFs!</h2>
    <Button className={`welcome__start${props.mode === ARRIVED ? '' : ' welcome__start--disabled'}`} disabled={props.mode !== ARRIVED} onClick={props.onContinue}>Create a GIF!</Button>
  </div>
}

class Welcome extends Component {

  componentWillReceiveProps({ mode, history }) {
    if (mode === COMPLETE) {
      history.replace('/communities')
    }
  }

  render() {
    const { nickname, mode } = this.props

    return <div className="welcome">
      {mode === ARRIVED && <Arrived onContinue={() => updateOnboarding(ONBOARD)} mode={mode} />}
      {mode === ONBOARD && <Onboarding onContinue={() => updateOnboarding(CAMERA_ACCESS)} />}
      {mode === CAMERA_ACCESS && <CameraAccess onGranted={() => updateOnboarding(CREATE)} />}
      {mode === CREATE && <div className="welcome__create">
          <Create nickname={nickname} onSave={this.onSave} />
      </div>}
    </div>
  }

  onSave = async data => {
    await updateOnboarding(COMPLETE)
    const communityId = await addCommunity()
    await updateCommunity(communityId, { title: NEW_COMMUNITY, createdBy: data.nickname })
    await addPublication(communityId, data)
    this.props.history.push(`/c/${communityId}`)
  }
}

export default Welcome
