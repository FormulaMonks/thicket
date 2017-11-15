import React, { Component } from 'react'
import { Button } from 'thicket-elements'

class Onboarding extends Component {
  
  state = { step: 1 }

  render() {
    const { onComplete } = this.props
    const { step } = this.state

    return <div className="onboarding">
      <div>Learn more about how Thicket works below.</div>
      {step === 1 && <div onClick={() => this.setState({ step: 2 })} className="onboarding__step1">Step 1.</div>}
      {step === 2 && <div onClick={() => this.setState({ step: 3 })} className="onboarding__step2">Step 2.</div>}
      {step === 3 && <div onClick={() => this.setState({ step: 4 })} className="onboarding__step3">All done.</div>}
      <div className="onboarding__controls">
        {step !== 3 && [
          <Button onClick={onComplete} key="skip">Skip Onboarding</Button>,
          <Button onClick={() => this.setState({ step: this.state.step + 1 })} key="next">Next</Button>
        ]}
        {step === 3 && <Button onClick={onComplete}>Finish</Button>}
      </div>
    </div>
  }
}

export default Onboarding
