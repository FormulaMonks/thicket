import React from 'react'
import styled from 'styled-components'
import { Button } from 'thicket-elements'

const Preview = styled.img`
  flex: 1;
  width: 100%;
  object-fit: cover;
  overflow: hidden;
`
const Controls = styled.div`
  width: 100%;
  display: flex;
  margin: 10px 0 0 0;
`

const Review = props => {
  const { reviewButton, reviewPreview, reviewControlsWrap, reviewRedo, reviewApprove } = props.classNames
  return [
    <Preview className={reviewPreview} key="preview" src={props.src} />,
    <Controls className={reviewControlsWrap}  key="controls">
      <Button className={`${reviewButton} ${reviewRedo}`} onClick={props.redo}>Redo</Button>
      <Button className={`${reviewButton} ${reviewApprove}`} onClick={props.approve}>Approve</Button>
    </Controls>,
  ]
}

export default Review
