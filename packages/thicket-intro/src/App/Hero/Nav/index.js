import React from 'react'
import styled from 'styled-components'
import citrusbyte from './citrusbyte.svg'

const Nav = styled.nav`
  padding: 1em 1em 0;
`

export default () => (
  <Nav>
    <a href="https://citrusbyte.com">
      <img src={citrusbyte} alt="Citrusbyte" style={{ height: '1.5em' }} />
    </a>
  </Nav>
)
