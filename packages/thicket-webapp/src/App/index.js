import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from 'react-router-dom'
import Profile from './Profile'
import Welcome, { FINISHED } from './Welcome'
import Communities from './Communities'
import Community from './Community'
import Gif from './Gif'
import { Spinner } from 'thicket-elements'
import store from '../database/store'
import './App.css'
import usersvg from './user.svg'

const { user } = store

class App extends Component {

  state = { nickname: '', loading: true, onboarding: null }

  componentDidMount() {
    this.fetchUser()
    user.on('update', this.fetchUser)
  }

  componentWillUnmount() {
    user.off('update', this.fetchUser)
  }

  render() {
    const { nickname, loading, onboarding } = this.state

    if (loading) {
      return <div className="index"><Spinner /></div>
    }

    return <Router>
      <main className="app">
        <Link className="app__home" to="/">Thicket</Link>
        <Link className="app__profile" to="/profile">
          {nickname}<img src={usersvg} alt={nickname}/>
        </Link>
        <Switch>
          <Route exact path="/profile" render={props => <Profile nickname={nickname} {...props} />} />
          <Route exact path="/welcome" render={props => <Welcome nickname={nickname} {...props} />} />
          <Route exact path="/communities" render={() => <Communities nickname={nickname} />} />
          <Route path="/c/:c" render={props => <Community {...props} nickname={nickname} />} />
          <Route exact path="/g/:c/:g" render={props => <Gif {...props} />} />
          <Redirect exact from="/" to={onboarding === FINISHED ? 'communities' : 'welcome'} />
        </Switch>
      </main>
    </Router>
  }

  fetchUser = async () => {
    const { nickname, onboarding } = await user.get()
    this.setState({ nickname, onboarding, loading: false })
  }

}

export default App
