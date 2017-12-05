import React, { Component } from 'react'
import styled from 'styled-components'
import {
  linearGradient,
  defaultBoxShadow,
  activeBoxShadow,
} from '../sharedStyles'

const StyledInput = styled.input`
  border: none;
  outline: none;
  border-radius: 4px;
  color: #274058;
  font-family: inherit;
  font-size: inherit;
  padding: 1em;
  margin: 1px;
  caret-color: #D266A0;

  &::placeholder{
    color: rgba(39, 64, 88, 0.6);
  }
`
const Wrap = styled.div`
  border-radius: 4px;
  background: ${linearGradient};
  display: inline-block;
  box-shadow: ${({ focused }) => focused ? activeBoxShadow : defaultBoxShadow}
`

class Input extends Component {

  state = { focused: false }

  render() {
    return <Wrap focused={this.state.focused}>
      <StyledInput
        {...this.props}
        autoFocus={this.state.focused}
        type="text"
        onFocus={() => this.setState({ focused: true })}
        onBlur={() => this.setState({ focused: false })}
      />
    </Wrap>
  }
}

export default Input
