import React from 'react'
import styled, { keyframes } from 'styled-components'

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #777
`
const spin = keyframes`
  to {transform: rotate(360deg);}
`
const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border-top: 3px solid #777;
  border-right: 2px solid transparent;
  animation: ${spin} 1s linear infinite;
`
const Loading = () => <Wrap>
  <Spinner />
  <h2>Just a moment</h2>
  <p>we’re putting your GIF together</p>
</Wrap>

export default Loading
