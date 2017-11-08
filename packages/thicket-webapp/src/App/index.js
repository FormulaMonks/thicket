import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom'
import localForage from 'localforage'
import Profile from './Profile'
import Welcome, { FINISHED } from './Welcome'
import Communities from './Communities'
import Community from './Community'
import Gif from './Gif'
import { Spinner } from 'thicket-elements'
import './App.css'
import user from './user.svg'

class App extends Component {

  state = { nickname: `Guest${Math.floor(1 + (Math.random() * 1000))}` }

  componentDidMount() {
    localForage.getItem('nickname').then(v => this.setState({ nickname: v || this.state.nickname }))
  }

  render() {
    const { nickname } = this.state

    return <Router>
      <main className="app">
        <Link className="app__home" to="/">Thicket</Link>
        <Link className="app__profile" to="/profile">{nickname}<img src={user} alt={nickname}/></Link>
        <Switch>
          <Route exact path="/profile" render={props => <Profile nickname={nickname} {...props} />} />
          <Route exact path="/welcome" render={props => <Welcome nickname={nickname} {...props} />} />
          <Route exact path="/communities" component={Communities} />
          <Route path="/c/:c" render={props => <Community {...props} nickname={nickname} />} />
          <Route exact path="/gif/:g" render={props => <Gif {...props} />} />
          <Route exact path="/" render={props => <Index {...props} />} />
        </Switch>
        <div className="app__citruslabs">Created by <a href="#">CitrusLabs</a></div>
      </main>
    </Router>
  }
}

const Index = props => {
  const { history } = props
  localForage.getItem('onboarding')
    .then(v => v === FINISHED ? history.replace('/communities') : history.replace('/welcome'))

  return <div className="index"><Spinner /></div>
}

export default App
