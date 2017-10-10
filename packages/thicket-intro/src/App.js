import React from 'react'
import { injectGlobal } from 'styled-components'
//

injectGlobal`
  body {
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,
      Arial,sans-serif;
    font-weight: 300;
    font-size: calc(.85em + 1vw);
    line-height: 1.5em;
    margin: 0;
    padding: 0;
  }
`

export default () => (
  <h1>Welcome Home!</h1>
)
