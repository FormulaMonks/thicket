import React, {Component} from 'react'
import {render} from 'react-dom'

import styled, { injectGlobal } from 'styled-components'

import Example from '../../src'

const light = 'white'
const dark = '#102131'

injectGlobal`
  * { background-color: inherit }
  html { font-size: calc(0.9em + 0.7vw) }
  body { margin: 0 }
  code, pre {
    box-shadow: inset 0 0 99em rgba(0,0,0,0.1), inset 0 0 99em rgba(255,255,255,0.2), inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 4px;
  }
  code {
    padding: 0.1em 0.3em;
    white-space: nowrap;
  }
  pre {
    padding: 1em;
    overflow: scroll;
  }
`

const Wrap = styled.main`
  padding: 1.5em 1.5em 10em;
  background: ${props => props.dark ? dark  : light };
  color: ${props => props.dark ? light : dark };

  h1 { margin-top: 0 }
`

const Head = styled.header`
  background: ${props => props.dark ? dark : light };
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;

  & > * { display: inline-block }
`

class Demo extends Component {

  state = { dark: false }

  render() {
    const { dark } = this.state
    return <Wrap dark={dark}>
      <Head dark={dark}>
        <h1>thicket-elements Demo</h1>
        <label>
          <input
            type="checkbox"
            checked={dark}
            onChange={e => this.setState({ dark: e.target.checked })}
          />
          dark
        </label>
      </Head>
      <Example dark={dark} />
    </Wrap>
  }
}

render(<Demo/>, document.querySelector('#demo'))
