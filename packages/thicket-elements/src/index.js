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
