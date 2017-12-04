import React, { Component } from 'react'

class Workflow extends Component {

  constructor(props) {
    super(props)
    this.state = { step: props.workflow[0].step }
  }

  render() {
    // avoid passing raw onContinue to component
    const { onContinue, ...props } = this.props
    const { Component } = this.props.workflow.find(x => x.step === this.state.step)
    return <Component onContinue={this.onContinue} {...props} />
  }

  onContinue = ({ step } = {}) => {
    const { workflow } = this.props
    const currentIndex = workflow.findIndex(x => x.step === this.state.step)
    const nextIndex = workflow.length > currentIndex + 1 ? currentIndex + 1 : currentIndex
    const nextStep = step || workflow[nextIndex].step
    this.setState({ step: nextStep })
    this.props.onContinue && this.props.onContinue(nextStep)
  }

}

export default Workflow
