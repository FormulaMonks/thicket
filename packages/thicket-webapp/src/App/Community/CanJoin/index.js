import React, { Component } from 'react'
import Onboarding from '../../../components/Onboarding'
import { Button } from 'thicket-elements'
import store from '../../../database/store'
import './CanJoin.css'
import { FINISHED } from '../../Welcome'

const { user, communities } = store
const ONBOARD = 'show the user how to get things done around here'
const TOS = 'show the user the terms of service'
const CAN_JOIN = 'present the user options to accept/decline the invitation to join the community'

const Prompt = props => <div className="join__header">
  Hey {props.nickname}, if you join this Community, you’ll be able to create & contribute GIFs.
  <Button onClick={props.onJoin}>Join</Button>
  <Button onClick={props.onDecline}>Decline</Button>
</div>

class CanJoin extends Component {

  state = { mode: ONBOARD, Prompt }

  async componentDidMount() {
    const { onboarding } = await user.get()
    if (onboarding === FINISHED) {
      let mode = CAN_JOIN
      if (this.props.CanJoinTos) {
        mode = TOS
      }
      this.setState({ mode })
    }
    const { CanJoinPrompt } = this.props
    if (CanJoinPrompt) {
      this.setState({ Prompt: CanJoinPrompt })
    }
  }

  render() {
    const { mode, Prompt } = this.state

    return [
      mode === ONBOARD && <div key="onboard" className="join__onboard">
          <Onboarding onComplete={this.onComplete} />
        </div>,
      mode === TOS && <this.props.CanJoinTos key="tos" onAccept={() => this.setState({ mode: CAN_JOIN })} />,
      mode === CAN_JOIN && <Prompt key="prompt" nickname={this.props.nickname} onJoin={this.onJoin} onDecline={this.onDecline} />
    ]
  }

  onComplete = async () => {
    await user.put({ onboarding: FINISHED })
    let mode = CAN_JOIN
    if (this.props.CanJoinTos) {
      mode = TOS
    }
    this.setState({ mode })
  }

  onDecline = () => this.props.history.replace('/welcome')

  onJoin = async () => {
    const { community } = this.props
    await communities.post(community)
    this.props.history.push(`/c/${community}`)
    this.props.onClose()
  }

}

export default CanJoin
