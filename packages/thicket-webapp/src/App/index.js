import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from 'react-router-dom'
import './App.css'

import Profile from './Profile'
import Welcome from './Welcome'
import Communities from './Communities'
import Community from './Community'
import Gif from './Gif'

const PROFILE = 'show user profile'
const TOS = 'show tos'
const FAQ = 'show faq'

class App extends Component {

  render() {
    return <Router>
      <main className="app">
        <Link className="app__home" to="/">Thicket</Link>
        <Link className="app__profile" to="/profile">Username</Link> 
        <Switch>
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/welcome" component={Welcome} />
          <Route exact path="/communities" component={Communities} />
          <Route exact path="/c/:c" render={props => <Community {...props} />} />
          <Route exact path="/gif/:g" render={props => <Gif {...props}/>} />
          <Route exact path="/" render={() => this.newUser() ? <Redirect to="/welcome" /> : <Redirect to="/communities" />} />
        </Switch>
        <div className="app__citruslabs">Created by <a href="#">CitrusLabs</a></div>
      </main>
    </Router>
  }

  newUser = () => {
    return true
  }
}

export default App
