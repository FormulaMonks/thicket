import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { Spinner } from 'thicket-elements'
import Loadable from 'react-loadable'

const Wrap = props => <div
  style={{
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Spinner />
</div>

const AsyncApp = Loadable({
  loader: () => import("../App"),
  loading: Wrap
})
const AsyncWelcome = Loadable({
  loader: () => import("../Welcome"),
  loading: Wrap
})

export default () => <Router>
  <Switch>
    <Redirect exact from="/" to="welcome" />
    <Route exact path="/welcome" render={props =>
      <AsyncWelcome {...props} />} />
    <Route path="/" component={AsyncApp} />
  </Switch>
</Router>
