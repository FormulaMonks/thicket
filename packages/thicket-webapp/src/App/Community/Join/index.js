import React, { Component } from 'react'
import localForage from 'localforage'

const ONBOARD = 'show the user how to get things done around here'
const JOIN = 'present the user options to accept/decline the invitation to join the community'

class Join extends Component {

  state = { mode: ONBOARD }

  render() {
    const { mode } = this.state

    return [
      mode === ONBOARD && <div key="onboard">Onboard</div>,
      mode === JOIN && <div key="join">Join</div>,
    ]
  }
}

export default Join
