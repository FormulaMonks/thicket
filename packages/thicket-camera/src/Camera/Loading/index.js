import React from 'react'
import { Spinner } from 'thicket-elements'

const Loading = props => {
  const { loadingSpinner, loadingTitle, loadingMessage } = props.classNames
  return [
    <Spinner className={loadingSpinner} key="spinner" />,
    <h2 className={loadingTitle} key="title">Just a moment</h2>,
    <p className={loadingMessage} key="message">we’re putting your GIF together</p>,
  ]
}

export default Loading
