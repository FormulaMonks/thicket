import React, { Component } from 'react'
import Create from '../Create'

const LANDED = 'the user just arrived'
const ONBOARDING = 'quick presentation of what thicket is'
const TOS = 'the user must abide by our rules'
const CAMERA_ACCESS = 'we need to be able to access the camera'
const CREATING = 'user is shooting first gif'
const NEW_COMMUNITY = 'Amazing GIFs'

class Landing extends Component{
  
  state = { mode: LANDED }
  
  render() {
    const { mode } = this.state
    return [
      mode === LANDED && <div key="welcome" onClick={() => this.setState({ mode: ONBOARDING })}>Continue to Onboarding</div>,
      mode === ONBOARDING && <div key="onboarding" onClick={() => this.setState({ mode: TOS })}>Continue to TOS</div>,
      mode === TOS && <div key="tos" onClick={() => this.setState({ mode: CAMERA_ACCESS})}>Continue to Camera Access</div>,
      mode === CAMERA_ACCESS && <div key="access" onClick={() => this.setState({ mode: CREATING })}>Create</div>,
      mode === CREATING && <Create key="create" onSave={() => this.props.history.push(`/c/${NEW_COMMUNITY}`)} />
    ]
  }
}

export default Landing
