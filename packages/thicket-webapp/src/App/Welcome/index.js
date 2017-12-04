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

const SplashPage = props => <div className="welcome__arrived">
  <h2>Connecting your world to others using the power of GIFs.</h2>
  <Button className="welcome__start" onClick={props.onContinue}>Create a GIF!</Button>
</div>

const CreateFirstGif = ({ nickname, history }) => <div className="welcome__create">
  <CreateGif
    nickname={nickname}
    onSave={async data => {
      // no need to call onContinue here since this is setting the onboarding step to completed
      user.put({ onboarding: COMPLETED, nickname: data.nickname })
      const community = await communities.post(NEW_COMMUNITY_ID)
      community.put({ title: NEW_COMMUNITY, createdBy: data.nickname })
      community.publications.post(data)
      history.push(`/c/${NEW_COMMUNITY_ID}/first-gif`)
    }}
  />
</div>

const Completed = ({ history }) => {
  history.replace('/communities')
  return null
}

const defaultOnboardingWorkflow = [
  { step: 'LOADING', Component: Loading },
  { step: 'SPLASH_PAGE', Component: SplashPage },
  { step: 'QUICK_EXPLANATION', Component: props => <QuickExplanation onComplete={props.onContinue} />},
  { step: 'NEED_CAMERA_ACCESS', Component: props => <CameraAccess onGranted={props.onContinue} />},
  { step: 'CREATING_FIRST_GIF', Component: CreateFirstGif },
  { step: COMPLETED, Component: Completed }
]

export default ({ onboardingWorkflow = x => x, ...props }) => <div className="welcome">
  <Workflow
    {...props}
    workflow={onboardingWorkflow(defaultOnboardingWorkflow)}
    onContinue={step => user.put({ onboarding: step })}
  />
</div>
