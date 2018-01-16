import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import Profile from './Profile'
import Welcome, { COMPLETED } from './Welcome'
import Communities from './Communities'
import Community from './Community'
import Gif from './Gif'
import { Spinner } from 'thicket-elements'
import store from '../database/store'
import './App.css'

const { user } = store

class App extends Component {

  state = { nickname: '', loading: true, onboarding: null }

  async componentDidMount() {
    user.on('update', this.fetchUser)
    await this.fetchUser()
    this.setState({ loading: false })
  }

  componentWillUnmount() {
    user.off('update', this.fetchUser)
  }

  render() {
    const { nickname, loading, onboarding } = this.state

    if (loading) {
      return <div className="app__index"><Spinner /></div>
    }

    return <Router>
      <Switch>
        <Route exact path="/profile" render={props => <Profile nickname={nickname} {...props} />} />
        <Route exact path="/welcome" render={props =>
          <Welcome onboarding={onboarding} {...props} />} />
        <Route exact path="/communities" render={() => <Communities nickname={nickname} />} />
        <Route path="/c/:c" render={props =>
          <Community
            {...props}
            nickname={nickname}
            canJoinWorkflow={this.props.canJoinWorkflow}
            canJoinOptions={this.props.canJoinOptions}
          />}
        />
        <Route exact path="/g/:c/:g" render={props => <Gif {...props} />} />
        <Redirect exact from="/" to={onboarding === COMPLETED ? 'communities' : 'welcome'} />
      </Switch>
    </Router>
  }

  fetchUser = async () => {
    const { nickname, onboarding } = await user.get()
    this.setState({ nickname, onboarding })
  }

}

export default App
