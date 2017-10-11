import React from 'react'
import styled from 'styled-components'

import { dark } from '../colors'
import noWifi from './no-wifi.svg'

const Wrapper = styled.div`
  min-height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const Explanation = styled.div`
  margin: 0 auto;
  padding 1em;
  max-width: 30em;
`

const Button = styled.button`
  background-color: transparent;
  border: 1px solid white;
  color: white;
  font-size: 1em;
  margin: 1em;
	padding: 0.5em 2.5em;
`

const DisabledButton = styled(Button)`
  border: 1px solid darkgrey;
  color: darkgrey;
  position: relative;
  z-index: 2;
  &:before, &:after {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
  &:before {
    position: absolute;
    padding: 0.5em 0;
    width: 100%;
    background-color: ${dark};
    border: 1px solid white;
    content: '${props => props.tip}';
    color: white;

    margin-top: 10px;
    top: 100%;
    left: 0;
  }
  &:after {
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    width: 0;
    border-bottom: 10px solid white;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    content: " ";
    font-size: 0;
    line-height: 0;
  }
  &:hover {
    &:before, &:after {
      visibility: visible;
      opacity: 1;
    }
  }
`

export default class GifCreator extends React.Component {

  state = { online: true }

  componentDidMount() {
    window.addEventListener('online', this.goOnline, false)
    window.addEventListener('offline', this.goOffline, false)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.goOnline, false)
    window.removeEventListener('offline', this.goOffline, false)
  }

  goOnline = () => this.setState({ online: true })
  goOffline = () => this.setState({ online: false })

  render() {
    const { id } = this.props
    const { online } = this.state

    return (
      <Wrapper id={id}>
        <Explanation>
          <img src={noWifi} alt="" style={{ height: '2.5em' }}/>
          <h2>Let's get started. Turn off that WiFi!</h2>
          <p>
            Before we can begin, please turn off your WiFi connection. This may
            sound crazy, but Thicket is actually built around the idea of Offline
            First. Once you turn off your connection, click the button below.
          </p>
          {online
            ? <DisabledButton disabled tip="🙅 📶">Create GIF</DisabledButton>
            : <Button>Create GIF</Button>
          }
        </Explanation>
      </Wrapper>
    )
  }
}
