import React, {Component} from 'react'

import Button from './Button'
import Spinner from './Spinner'
import * as BottomNav from './BottomNav'

export default () => (
  <div>
    <h2>Spinner</h2>
    <Spinner />
    <h2>BottomNav.Camera</h2>
    <BottomNav.Camera onClick={() => console.log('camera coming right up!')} />
    <h2>BottomNav.Again</h2>
    <BottomNav.Again onClick={() => console.log('again, again!')} />
    <h2>BottomNav.Accept</h2>
    <BottomNav.Accept onClick={() => console.log('accepted!')} />
    <h2>BottomNav.Shoot</h2>
    <BottomNav.Shoot onClick={() => console.log('shoot!')} />
    <h2>BottomNav.Cancel</h2>
    <BottomNav.Cancel onClick={() => console.log('cancel!')} />
    <h2>Button</h2>
    <Button onClick={() => console.log('button!')}>Click Me</Button>
  </div>
)

export {
  Spinner,
  BottomNav,
  Button,
}
