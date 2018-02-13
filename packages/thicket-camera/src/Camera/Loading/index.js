import React from 'react'
import styled from 'styled-components'
import { Spinner } from 'thicket-elements'

const Title = styled.p`
  font-size: 2em;
  margin-bottom: 0;
`

const Loading = props => {
  const { loadingSpinner, loadingTitle, loadingMessage } = props.classNames
  return [
    <Spinner className={loadingSpinner} key="spinner" />,
    <Title className={loadingTitle} key="title">Just a moment</Title>,
    <p className={loadingMessage} key="message">we’re putting your GIF together</p>,
  ]
}

export default Loading
