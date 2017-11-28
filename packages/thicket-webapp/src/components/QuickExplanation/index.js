import React, { Component } from 'react'
import { Button } from 'thicket-elements'

const wordings = new Map([
  [
    1,
    `Step 1`
  ],
  [
    2,
    `Step 2`
  ],
  [
    3,
    `Step 3`
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
