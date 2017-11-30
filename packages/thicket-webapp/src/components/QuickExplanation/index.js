import React, { Component } from 'react'
import { Button } from 'thicket-elements'

const wordings = new Map([
  [
    1,
    `Thicket is a new kind of app where your data isn't controlled by any
    central authority.`
  ],
  [
    2,
    `All the GIFs you create are stored right on your device, and on the
    devices of your friends.`
  ],
  [
    3,
    `If you are part of a Thicket Community, you are helping back up and
    preserve that community's GIFs.`
  ],
  [
    4,
    `You are not the product. No ads or tracking, ever.`
  ],
])

class QuickExplanation extends Component {

  state = { step: 1 }

  render() {
    const { onComplete } = this.props
    const { step } = this.state

    return <div className="onboarding">
      <div>Learn more about how Thicket works below.</div>
      <div>
        {wordings.get(step)}
      </div>
      <div className="onboarding__controls">
        {step !== wordings.size && [
          <Button onClick={onComplete} key="skip">Skip Onboarding</Button>,
          <Button onClick={() => this.setState({ step: this.state.step + 1 })} key="next">Next</Button>
        ]}
        {step === wordings.size && <Button onClick={onComplete}>Finish</Button>}
      </div>
    </div>
  }
}

export default QuickExplanation
