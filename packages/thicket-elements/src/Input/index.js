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
`

const Base = styled.div`
  border-radius: 4px;
  background: ${linearGradient};
  display: inline-block;
`

const Wrap = Base.extend`
  opacity: .6;
  box-shadow: ${defaultBoxShadow};
`
const WrapFocus = Base.extend`
  opacity: 1;
  box-shadow: ${activeBoxShadow};
`

class Input extends Component {

  state = { focused: false }

  render() {
    const Wrapper = this.state.focused ? WrapFocus : Wrap
    return <Wrapper>
      <StyledInput
        {...this.props}
        autoFocus={this.state.focused}
        type="text"
        onFocus={() => this.setState({ focused: true })}
        onBlur={() => this.setState({ focused: false })}
      />
    </Wrapper>
  }
}

export default Input
