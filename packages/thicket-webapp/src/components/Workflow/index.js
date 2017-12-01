import React, { Component } from 'react'

class Workflow extends Component {

  constructor(props) {
    super(props)
    this.state = { step: props.workflow[0].step }
  }

  render() {
    const { Component } = this.props.workflow.find(x => x.step === this.state.step)
    return <Component onContinue={this.onContinue} {...this.props} />
  }

  onContinue = ({ step } = {}) => {
    const { workflow } = this.props
    const currentIndex = workflow.findIndex(x => x.step === this.state.step)
    const nextIndex = workflow.length > currentIndex + 1 ? currentIndex + 1 : currentIndex
    this.setState({ step: step || workflow[nextIndex].step })
  }

}

export default Workflow
