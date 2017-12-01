import React from 'react'
import QuickExplanation from '../../../components/QuickExplanation'
import { Button } from 'thicket-elements'
import store from '../../../database/store'
import Workflow from '../../../components/Workflow'
import './CanJoin.css'
import { COMPLETED } from '../../Welcome'

const { user, communities } = store

const Explain = props => {
  user.get().then(({ onboarding }) => {
    if (onboarding === COMPLETED) {
      props.onContinue()
    }
  })
  return <div className="join__onboard">
    <QuickExplanation onComplete={() => {
      user.put({ onboarding: COMPLETED })
      props.onContinue()
    }} />
  </div>
}

const onDecline = async props => {
  await user.put({ onboarding: null })
  props.history.replace('/welcome')
}

const onJoin = async props => {
  const { community, history, onContinue } = props
  await communities.post(community)
  history.push(`/c/${community}`)
  onContinue()
}

const Prompt = ({ nickname, history, onContinue, options, community }) => {
  return <div className="join__header">
    Hey {nickname}, if you join this Community, you’ll be able to create & contribute GIFs.
    {options.map(({ label, action }) =>
      <Button
        key={label}
        onClick={() => action({ community, history, onContinue })}
      >
        {label}
      </Button>)}
  </div>
}

const defaultCanJoinWorkflow = [
  { step: 'QUICK_EXPLANATION', Component: Explain },
  { step: 'PROMPT', Component: Prompt },
  { step: COMPLETED, Component: () => null }
]

const defaultCanJoinOptions = [
  { label: 'Join', action: onJoin },
  { label: 'Decline', action: onDecline }
]

const identity = x => x

export default ({ canJoinOptions = identity, canJoinWorkflow = identity, ...props }) =>
  <Workflow
    {...props}
    workflow={canJoinWorkflow(defaultCanJoinWorkflow)}
    options={canJoinOptions(defaultCanJoinOptions)}
  />
