import React from 'react'
import styled from 'styled-components'

const Preview = styled.img`
  flex: 1;
  width: 100%;
  object-fit: cover;
  background-color: #C4C4C4;
  overflow: hidden;
`
const Controls = styled.div`
  width: 100%;
  display: flex;
  margin: 10px 0 0 0;
`
const Button = styled.button`
  cursor: pointer;
  border: 1px solid #777;
  padding: 20px;
  background: transparent;
  color: #777;
  &:hover{
    background: #777;
    color: #FFF;
  }
`
const Redo = Button.extend`
  min-width: 30%;
  margin-right: 5px;
`
const Approve = Button.extend`
  flex: 1;
  margin-left: 5px;
`

const Review = props => [
  <Preview key="preview" src={props.src} />,
  <Controls key="controls">
    <Redo onClick={props.redo}>Redo</Redo>
    <Approve onClick={props.approve}>Approve</Approve>
  </Controls>,
]

export default Review
