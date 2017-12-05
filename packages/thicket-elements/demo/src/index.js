import React, {Component} from 'react'
import {render} from 'react-dom'

import styled, { injectGlobal } from 'styled-components'

import Example from '../../src'

const light = 'white'
const dark = '#102131'

injectGlobal`
  body { margin: 0 }
`

const Wrap = styled.main`
  padding: 1.5em 1.5em 3em;
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
    return <Wrap dark={this.state.dark}>
      <Head dark={this.state.dark}>
        <h1>thicket-elements Demo</h1>
        <label>
          <input
            type="checkbox"
            checked={this.state.dark}
            onChange={e => this.setState({ dark: e.target.checked })}
          />
          dark
        </label>
      </Head>
      <Example/>
    </Wrap>
  }
}

render(<Demo/>, document.querySelector('#demo'))
