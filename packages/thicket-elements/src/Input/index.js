import React, { Component } from 'react'
import styled from 'styled-components'
import pencil from '../../images/pencil.svg'
import {
  linearGradient,
  defaultBoxShadow,
  activeBoxShadow,
} from '../sharedStyles'

const StyledInput = styled.input`
  background: transparent url(${pencil}) no-repeat right center;
  background-size: 1em;
  border: none;
  outline: none;
  opacity: .6;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  padding: 0.5em 0;
  padding-right: 1.2em;
  caret-color: #D266A0;

  & + div{
    opacity: .6;
    height: 2px;
    background: ${linearGradient};
    box-shadow: ${activeBoxShadow};
    position: relative;
  }

  &:hover, &:hover + div {
    opacity: .8;
  }

  &:focus{
    opacity: 1;
    background: transparent;

    & + div{
      opacity: 1;
      box-shadow: ${defaultBoxShadow};
    }
  }
`
const Wrap = styled.div`
  display: inline-block;
`

class Input extends Component {

  state = { focused: false }

  render() {
    return <Wrap>
      <StyledInput
        {...this.props}
        autoFocus={this.state.focused}
        type="text"
      />
      <div />
    </Wrap>
  }
}

export default Input
