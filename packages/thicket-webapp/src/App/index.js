import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
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

  state = { nickname: '' }

  componentDidMount() {
    this.fetchNickname()
    user.on('update', this.fetchNickname)
  }

  componentWillUnmount() {
    user.off('update', this.fetchNickname)
  }

  render() {
    const { nickname } = this.state
    const { components = {} } = this.props
    const { Tos, CanJoinTos, CanJoinPrompt } = components

    return <Router>
      <main className="app">
        <Link className="app__home" to="/">Thicket</Link>
        <Link className="app__profile" to="/profile">{nickname}<img src={usersvg} alt={nickname}/></Link>
        <Switch>
          <Route exact path="/profile" render={props => <Profile nickname={nickname} {...props} />} />
          <Route exact path="/welcome" render={props => <Welcome nickname={nickname} {...props} Tos={Tos} />} />
          <Route exact path="/communities" render={() => <Communities nickname={nickname} />} />
          <Route path="/c/:c" render={props =>
            <Community {...props} nickname={nickname} CanJoinTos={CanJoinTos} CanJoinPrompt={CanJoinPrompt} />} />
          <Route exact path="/g/:c/:g" render={props => <Gif {...props} />} />
          <Route exact path="/" render={props => <Index {...props} />} />
        </Switch>
      </main>
    </Router>
  }

  fetchNickname = () =>
    user.get().then(({ nickname }) => this.setState({ nickname }))

}

const Index = props => {
  const { history } = props
  user.get().then(({ onboarding }) => onboarding === FINISHED ? history.replace('/communities') : history.replace('/welcome'))

  return <div className="index"><Spinner /></div>
}

export default App
