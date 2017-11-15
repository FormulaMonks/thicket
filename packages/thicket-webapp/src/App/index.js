import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom'
import Profile from './Profile'
import Welcome from './Welcome'
import Communities from './Communities'
import Community from './Community'
import Gif from './Gif'
import { Spinner } from 'thicket-elements'
import localDB, { COMPLETE } from '../database/localDB'
import './App.css'
import usersvg from './user.svg'

class App extends Component {

  state = { loading: true }

  componentDidMount() {
    this.getState()
    localDB.on('update', this.getState)
  }

  componentWillUnmount() {
    localDB.off('update', this.getState)
  }

  render() {
    if (this.state.loading) {
      return <div className="index"><Spinner /></div>
    }

    const { nickname, onboarding } = this.state

    return <Router>
      <main className="app">
        <Link className="app__home" to="/">Thicket</Link>
        <Link className="app__profile" to="/profile">{nickname}<img src={usersvg} alt={nickname}/></Link>
        <Switch>
          <Route exact path="/profile" render={props => <Profile nickname={nickname} {...props} />} />
          <Route exact path="/welcome" render={props =>
            <Welcome history={props.history} nickname={nickname} mode={onboarding} />} />
          <Route exact path="/communities" render={() => <Communities nickname={nickname} />} />
          <Route path="/c/:c" render={props => <Community {...props} nickname={nickname} />} />
          <Route exact path="/gif/:g" render={props => <Gif {...props} />} />
          <Route exact path="/" render={props => <Index history={props.history} onboarding={onboarding} />} />
        </Switch>
        <div className="app__citruslabs">Created by <a href="#">CitrusLabs</a></div>
      </main>
    </Router>
  }

  getState = async () => {
    const state = await localDB.get()
    this.setState({ ...state, loading: false })
  }

}

const Index = ({ history, onboarding }) => {
  if (onboarding === COMPLETE) {
    history.replace('/communities')
  }
  history.replace('/welcome')

  return <div className="index"><Spinner /></div>
}

export default App
