import React, { Component } from 'react'
import Onboarding from '../../../components/Onboarding'
import { Button } from 'thicket-elements'
import store from '../../../database/store'
import './CanJoin.css'
import { FINISHED } from '../../Welcome'

const { user, communities } = store
const ONBOARD = 'show the user how to get things done around here'
const CAN_JOIN = 'present the user options to accept/decline the invitation to join the community'

class CanJoin extends Component {

  state = { mode: ONBOARD }

  async componentDidMount() {
    const { onboarding } = await user.get()
    if (onboarding === FINISHED) {
      this.setState({ mode: CAN_JOIN })
    }
  }

  render() {
    const { mode } = this.state

    return [
      mode === ONBOARD && <div key="onboard" className="join__onboard">
          <Onboarding onComplete={this.onComplete} />
        </div>,
      mode === CAN_JOIN && <div key="join" className="join__header">
          Hey {this.props.nickname}, if you join this Community, you’ll be able to create & contribute GIFs.<Button onClick={this.onJoin}>Join</Button><Button onClick={this.onDecline}>Decline</Button>
        </div>,
    ]
  }

  onComplete = async () => {
    await user.put({ onboarding: FINISHED })
    this.setState({ mode: CAN_JOIN })
  }

  onDecline = () => this.props.history.replace('/welcome')

  onJoin = async () => {
    const { community } = this.props
    await communities.post(community)
    this.props.onClose()
  }

}

export default CanJoin
