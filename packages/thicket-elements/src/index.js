import React, {Component} from 'react'

import Spinner from './Spinner'
import * as BottomNav from './BottomNav'

export default () => (
  <div>
    <h2>Spinner</h2>
    <Spinner />
    <h2>BottomNav.Camera</h2>
    <BottomNav.Camera onClick={() => alert('camera coming right up!')} />
    <h2>BottomNav.Again</h2>
    <BottomNav.Again onClick={() => alert('again, again!')} />
    <h2>BottomNav.Accept</h2>
    <BottomNav.Accept onClick={() => alert('accepted!')} />
    <h2>BottomNav.Shoot</h2>
    <BottomNav.Shoot onClick={() => alert('shoot!')} />
    <h2>BottomNav.Cancel</h2>
    <BottomNav.Cancel onClick={() => alert('cancel!')} />
  </div>
)

export {
  Spinner,
  BottomNav,
}
