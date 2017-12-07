import React, {Component} from 'react'

import Button from './Button'
import Spinner from './Spinner'
import Input from './Input'
import * as Styles from './sharedStyles'

export default () => (
  <div>
    <h2>Spinner</h2>
    <Spinner />
    <h2>Button</h2>
    <Button onClick={() => console.log('button!')}>Click Me</Button>
    <h2>Secondary Button</h2>
    <Button secondary onClick={() => console.log('button!')}>Click Me</Button>
    <p>
      <small>
        <code>SecondaryButton</code> needs a global <code>* &#123; background-color: inherit &#125;</code> to work properly
      </small>
    </p>
    <h2>Text Input</h2>
    <Input placeholder="Text Input" />
  </div>
)

export {
  Spinner,
  Button,
  Input,
  Styles,
}
