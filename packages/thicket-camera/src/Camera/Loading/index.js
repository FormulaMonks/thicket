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
const H2 = styled.h2`
  margin: 20px 0 0 0;
`
const P = styled.p`
  margin: 10px 0 0 0;
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
  <H2>Just a moment</H2>
  <P>we’re putting your GIF together</P>
</Wrap>

export default Loading
