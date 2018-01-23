import React from 'react'
import styled from 'styled-components'
import { Button } from 'thicket-elements'

const Wrap = styled.div`
  padding: 1em;
`

const Title = styled.p`
  font-size: 2em;
`

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

export default props => {
  const { reviewWrap, reviewTitle, reviewMsg, reviewButton, reviewPreview, reviewControlsWrap, reviewRedo, reviewApprove } = props.classNames
  return <Wrap className={reviewWrap}>
    <Title className={reviewTitle}>Here’s your GIF!</Title>
    <div className={reviewMsg}>What do you think?</div>
    <Preview className={reviewPreview} key="preview" src={props.src} />
    <Controls className={reviewControlsWrap}  key="controls">
      <Button className={`${reviewButton} ${reviewApprove}`} onClick={props.approve}>Approve GIF</Button>
      <Button secondary className={`${reviewButton} ${reviewRedo}`} onClick={props.redo}>Retake</Button>
    </Controls>
  </Wrap>
}
