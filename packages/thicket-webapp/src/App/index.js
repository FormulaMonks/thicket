import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from 'react-router-dom'
import Setup from '../components/Setup'
import Logo from '../components/Logo'
import UserProfile from '../components/UserProfile'
import Profile from './Profile'
import Communities from './Communities'
import Community from './Community'
import NotFound from './404'
import Gif from './Gif'
import { Spinner } from 'thicket-elements'
import store from '../database/store'
import './Theme.css'
import './App.css'

const { user } = store

class App extends Component {

  state = { nickname: '', loading: true }

  async componentDidMount() {
    user.on('update', this.fetchUser)
    await this.fetchUser()
    const { blacklistedCommunities=[] } = this.props
    await user.removeBlacklistedCommunities(blacklistedCommunities)
    this.setState({ loading: false })
  }

  componentWillUnmount() {
    user.off('update', this.fetchUser)
  }

  render() {
    const { nickname, loading } = this.state

    if (loading) {
      return <div className="app__index"><Spinner /></div>
    }

    return <Router>
      <div className="app">
        <header className="app__header">
          <Link to="/communities"><Logo /></Link>
          {this.props.header}
          <Link to="/profile"><UserProfile nickname={nickname} /></Link>
        </header>
        <Switch>
          <Route exact path="/profile" render={props => <Profile nickname={nickname} {...props} />} />
          <Route
            exact
            path="/communities"
            render={props =>
              <Communities
                {...props}
                nickname={nickname}
                blacklistedCommunities={this.props.blacklistedCommunities}
              />
            }
          />
          <Route path="/c/:c" render={props =>
            <Community
              {...props}
              nickname={nickname}
              onInviteHook={this.props.onInviteHook}
              onShareHook={this.props.onShareHook}
              onCreateGif={this.props.onCreateGif}
              communityBtnsHook={this.props.communityBtnsHook}
              blacklistedCommunities={this.props.blacklistedCommunities}
            />}
          />
          <Route exact path="/g/:c/:g" render={props => <Gif {...props} />} />
          <Route exact path="/setup" render={props => <Setup nickname={nickname} {...props} />} />
          <Route path='/404' component={NotFound} />
          <Redirect exact from='/' to='/communities' />
          <Redirect from='*' to='/404' />
        </Switch>
      </div>
    </Router>
  }

  fetchUser = async () => {
    const { nickname } = await user.get()
    this.setState({ nickname })
  }

}

export default App
