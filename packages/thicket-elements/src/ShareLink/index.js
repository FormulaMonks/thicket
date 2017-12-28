import React from 'react'
import styled, { css } from 'styled-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactSVG from 'react-svg'

import clipboard from './clipboard.svg'
import checkmark from './checkmark.svg'
import { linearGradient } from '../sharedStyles'

export Trigger from './Trigger'

const Box = styled.div`
  background-color: white;
  border: 1px solid rgba(8, 19, 31, 0.5);
  border-radius: 4px;
  color: black;
  margin-top: 10px;
  padding: 1em;
  position: absolute;
  text-align: left;
`

const ControlsWrap = styled.div`
  display: flex;
  width: 100%;
  margin-top: 0.5em;
`

const InputWrap = styled.div`
  background: ${linearGradient};
  border-radius: 4px;
  padding: 1px;
  margin-right: 0.25em;
`

const Input = styled.input`
  background-color: white;
  border: none;
  border-radius: 4px;
  font-size: inherit;
  flex: 1;
  padding: 0.25em 0.5em;
`

const ButtonWrap = styled.div`
  background: ${linearGradient};
  border-radius: 4px;
  padding: 1px;
`

const Button = styled.button`
  border: none;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  height: 100%;
  &:focus, &:hover {
    background: ${linearGradient};
    outline: none;
    & path {
      fill: white;
    }
  }
  ${props => props.copied && css`
    background: ${linearGradient};
    & path {
      fill: white;
    }
  `}
`

const Text = styled.span`
  position: absolute;
  top: -9999em;
  left: -9999em;
`

const SVG = styled(ReactSVG)`
`

export default class ShareLink extends React.Component {
  state = { copied: false }

  maybeBlur = e => {
    if (
      !e.relatedTarget ||
      (this.box && !this.box.contains(e.relatedTarget))
    ) {
      this.props.onBlur()
    }
  }

  render() {
    const { copied } = this.state
    const {
      title = <span>the <code>title</code> prop</span>,
      body = <span>the <code>body</code> prop</span>,
      toCopy = window.location.href,
    } = this.props
    return (
      <Box
        tabIndex="0"
        onBlur={this.maybeBlur}
        innerRef={box => this.box = box}
      >
        <div><strong>{title}</strong></div>
        <label htmlFor="url">{body}</label>
        <ControlsWrap>
          <InputWrap>
            <Input
              readOnly
              id="url"
              value={toCopy}
              innerRef={input => { if (input) { input.focus(); input.select(); } } }
            />
          </InputWrap>
          <CopyToClipboard
            text={toCopy}
            onCopy={() => this.setState({ copied: true })}
          >
            <ButtonWrap>
              <Button copied={copied}>
                <SVG path={copied ? checkmark : clipboard} />
                <Text>Copy</Text>
              </Button>
            </ButtonWrap>
          </CopyToClipboard>
        </ControlsWrap>
      </Box>
    )
  }
}
