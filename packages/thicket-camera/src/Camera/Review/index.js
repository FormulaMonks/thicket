import React from 'react'
import styled from 'styled-components'

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
const Button = styled.button`
  cursor: pointer;
  border: 1px solid #000;
  padding: 20px;
  background: #FFF;
  color: #000;
  width: 50%;
  
  &:hover{
    background: #000;
    color: #FFF;
  }
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
