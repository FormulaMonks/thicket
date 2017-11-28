import React, { Component } from 'react'
import { Button } from 'thicket-elements'
import uuid from 'uuid'
import store from '../../database/store'
import CreateGif from '../../components/CreateGif'
import QuickExplanation from '../../components/QuickExplanation'
import CameraAccess from '../../components/CameraAccess'
import './Welcome.css'

const { user, communities } = store
const NEW_COMMUNITY = 'Amazing GIFs'
const NEW_COMMUNITY_ID = uuid()

const SplashPage = props => {
  return <div className="welcome__arrived">
    <h2>Welcome to Thicket, a simple web app for creating and sharing GIFs!</h2>
    <Button className="welcome__start" onClick={props.onContinue}>Create a GIF!</Button>
  </div>
}
const defaultOnboardingWorkflow = [
  { step: 'LOADING', Component: () => <div>Loading</div> },
  { step: 'SPLASH_PAGE', Component: SplashPage },
  { step: 'QUICK_EXPLANATION', Component: props => <QuickExplanation onComplete={props.onContinue} /> },
  { step: 'NEED_CAMERA_ACCESS', Component: props => <CameraAccess onGranted={props.onContinue} /> },
  { step: 'CREATING_FIRST_GIF', Component: props => <div className="welcome__create">
    <CreateGif nickname={props.nickname} onSave={props.onContinue} />
  </div>},
  { step: 'COMPLETED', Component: () => null }
]

class Welcome extends Component {

  state = { step: 'LOADING' }

  async componentDidMount() {
    const { onboarding } = await user.get()
    if (onboarding === 'COMPLETED') {
      this.props.history.replace("/communities")
    }
    this.setState({ step: onboarding || this.props.workflow[1].step })
  }

  render() {
    const { Component } = this.props.workflow.find(x => x.step === this.state.step)

    return <div className="welcome">
      <Component onContinue={this.onContinue} nickname={this.props.nickname} />
    </div>
  }

  onContinue = async data => {
    const { workflow, history } = this.props
    const currentIndex = workflow.findIndex(x => x.step === this.state.step)
    const nextIndex = currentIndex + 1
    const step = workflow.length > nextIndex ? workflow[nextIndex] : 'COMPLETED'
    user.put({ onboarding: step })
    this.setState({ step: step })
    if (step === 'COMPLETED') {
      user.put({ onboarding: 'COMPLETED', nickname: data.nickname })
      const community = await communities.post(NEW_COMMUNITY_ID)
      community.put({ title: NEW_COMMUNITY, createdBy: data.nickname })
      community.publications.post(data)
      history.push(`/c/${NEW_COMMUNITY_ID}/first-gif`)
    }
  }
}

export default ({ onboardingWorkflow = x => x, ...props }) =>
  <Welcome {...props} workflow={onboardingWorkflow(defaultOnboardingWorkflow)} />
