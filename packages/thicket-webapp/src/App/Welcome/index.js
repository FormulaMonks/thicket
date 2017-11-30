import React from 'react'
import { Button } from 'thicket-elements'
import uuid from 'uuid'
import store from '../../database/store'
import CreateGif from '../../components/CreateGif'
import QuickExplanation from '../../components/QuickExplanation'
import CameraAccess from '../../components/CameraAccess'
import Workflow from '../../components/Workflow'
import './Welcome.css'

export const COMPLETED = 'COMPLETED'
const { user, communities } = store
const NEW_COMMUNITY = 'Amazing GIFs'
const NEW_COMMUNITY_ID = uuid()

const Loading = ({ onContinue, onboarding }) => {
  onContinue({ step: onboarding })
  return null
}

const SplashPage = props => {
  user.put({ onboarding: 'SPLASH_PAGE' })
  return <div className="welcome__arrived">
    <h2>Welcome to Thicket, a simple web app for creating and sharing GIFs!</h2>
    <Button className="welcome__start" onClick={props.onContinue}>Create a GIF!</Button>
  </div>
}

const Explain = props => {
  user.put({ onboarding: 'QUICK_EXPLANATION' })
  return <QuickExplanation onComplete={props.onContinue} />
}

const Access = props => {
  user.put({ onboarding: 'NEED_CAMERA_ACCESS' })
  return <CameraAccess onGranted={props.onContinue} />
}

const CreateFirstGif = props => {
  user.put({ onboarding: 'CREATING_FIRST_GIF'})
  return <div className="welcome__create">
    <CreateGif nickname={props.nickname} onSave={async data => {
      user.put({ onboarding: 'COMPLETED', nickname: data.nickname })
      const community = await communities.post(NEW_COMMUNITY_ID)
      community.put({ title: NEW_COMMUNITY, createdBy: data.nickname })
      community.publications.post(data)
      props.history.push(`/c/${NEW_COMMUNITY_ID}/first-gif`)
    }} />
  </div>
}

const defaultOnboardingWorkflow = [
  { step: 'LOADING', Component: Loading },
  { step: 'SPLASH_PAGE', Component: SplashPage },
  { step: 'QUICK_EXPLANATION', Component: Explain },
  { step: 'NEED_CAMERA_ACCESS', Component: Access },
  { step: 'CREATING_FIRST_GIF', Component: CreateFirstGif },
  { step: COMPLETED, Component: () => null }
]

export default ({ onboardingWorkflow = x => x, ...props }) => <div className="welcome">
  <Workflow {...props} workflow={onboardingWorkflow(defaultOnboardingWorkflow)} />
</div>
