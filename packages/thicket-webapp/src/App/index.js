import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from 'react-router-dom'
import './App.css'

import Welcome from './Welcome'
import Communities from './Communities'
import Community from './Community'
import Gif from './Gif'

const PROFILE = 'show user profile'
const TOS = 'show tos'
const FAQ = 'show faq'

class App extends Component {

  state = { mode: '' }

  render() {
    const { mode } = this.state
    return <Router>
      <main className="app">
        <header>
          <Link to="/">Thicket</Link>
          <div onClick={() => this.setState({ mode: PROFILE })}>Username</div>
        </header>
        <Switch>
          <Route exact path="/welcome" component={Welcome} />
          <Route exact path="/communities" component={Communities} />
          <Route exact path="/c/:c" render={props => <Community {...props} />} />
          <Route exact path="/gif/:g" render={props => <Gif {...props}/>} />
          <Route exact path="/" render={() => this.newUser() ? <Redirect to="/welcome" /> : <Redirect to="/communities" />} />
        </Switch>
        {[
          mode === PROFILE && <div key="pofile" onClick={() => this.setState({ mode: '' })}>Close User profile</div>,
          mode === TOS && <div key="tos" onClick={() => this.setState({ mode: '' })}>Close TOS</div>,
          mode === FAQ && <div key="faq" onClick={() => this.setState({ mode: '' })}>Close FAQ</div>,
        ]}
        <footer>
          <div onClick={() => this.setState({ mode: FAQ })}>FAQ</div>
          <div onClick={() => this.setState({ mode: TOS })}>TOS</div>
          <div>Created by CitrusLabs</div>
        </footer>
      </main>
    </Router>
  }

  newUser = () => {
    return true
  }
}

export default App
