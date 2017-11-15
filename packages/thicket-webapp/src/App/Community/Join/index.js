import React, { Component } from 'react'
import Onboarding from '../../../components/Onboarding'
import { Button } from 'thicket-elements'
import store from '../../../database/store'
import './Join.css'

const { communities } = store
const ONBOARD = 'show the user how to get things done around here'
const JOIN = 'present the user options to accept/decline the invitation to join the community'

class Join extends Component {

  state = { mode: ONBOARD }

  render() {
    const { mode } = this.state

    return [
      mode === ONBOARD && <div key="onboard" className="join__onboard">
          <Onboarding onComplete={() => this.setState({ mode: JOIN })} />
        </div>,
      mode === JOIN && <div key="join" className="join__header">
          Hey {this.props.nickname}, if you join this Community, you’ll be able to create & contribute GIFs.<Button onClick={this.onJoin}>Join</Button><Button onClick={this.onDecline}>Decline</Button>
        </div>,
    ]
  }

  onDecline = () => this.props.history.replace('/welcome')

  onJoin = async () => {
    const { community } = this.props
    await communities.post(community)
    this.props.onClose()
  }

}

export default Join
