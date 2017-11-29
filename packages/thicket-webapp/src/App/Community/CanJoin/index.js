import React, { Component } from 'react'
import QuickExplanation from '../../../components/QuickExplanation'
import { Button } from 'thicket-elements'
import store from '../../../database/store'
import Workflow from '../../../components/Workflow'
import './CanJoin.css'

const { user, communities } = store

const SplashPage = props => {
  user.get().then(({ onboarding }) =>
    props.onContinue({ step: onboarding === 'COMPLETED' ? 'PROMPT' : null }))
  return null
}

const Explain = props => <div className="join__onboard">
  <QuickExplanation onComplete={() => {
    user.put({ onboarding: 'COMPLETED' })
    props.onContinue()
  }} />
</div>

const onDecline = props => props.history.replace('/welcome')

const onJoin = async props => {
  const { community, history, onContinue } = props
  await communities.post(community)
  history.push(`/c/${community}`)
  onContinue()
}

const Prompt = props => {
  return <div className="join__header">
    Hey {props.nickname}, if you join this Community, you’ll be able to create & contribute GIFs.
    <Button onClick={() => onJoin(props)}>Join</Button>
    <Button onClick={() => onDecline(props)}>Decline</Button>
  </div>
}

const defaultCanJoinWorkflow = [
  { step: 'SPLASH_PAGE', Component: SplashPage },
  { step: 'QUICK_EXPLANATION', Component: Explain },
  { step: 'PROMPT', Component: Prompt },
  { step: 'COMPLETED', Component: () => null }
]

export default ({ canJoinWorkflow = x => x, ...props }) =>
  <Workflow {...props} workflow={canJoinWorkflow(defaultCanJoinWorkflow)} />
