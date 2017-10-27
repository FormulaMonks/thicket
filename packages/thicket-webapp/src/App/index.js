import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import Camera from './Camera'
import Stream from './Stream'
import Publication from './Publication'
import { BottomNav as Nav } from 'thicket-elements'
import BackNav from './Back'
import { Spinner } from 'thicket-elements'
import './App.css'
import { set, get } from '../database/localStorage'

import db, { initialState } from './syncedDB';

class App extends Component {

  state = { communities: [], loaded: false }

  componentDidMount() {
    get('communities').then(data => this.setState({ loaded: true, communities: data || [] }))
  }

  render() {
    const { loaded, communities } = this.state

    return <Router>
      <div className="app">
        <header className="app__header">
          <Route path="/:x" render={() =>
            <BackNav to="/" alt="Back Home" />} />
          Thicket
        </header>
        <main className="app__main">
          {!loaded
            ? <div className="stream__spinner"><Spinner /></div>
            : <Switch>
                <Route exact path="/" render={() => {
                    return [
                      <div key="mine">My GIFs?</div>,
                      <div key="commis">My Communities?</div>,
                    ]
                  }
                }/>
                <Route exact path="/camera" component={Camera} />
                <Route exact path="/gif/:id" render={props =>
                  <Publication {...props}/>
                }/>
                <Route exact path="/c/:c" render={props =>
                  <Community {...props} communities={communities}/>
                }/>
                <Route exact path="/invite/:code" render={props =>
                  <Invite {...props} communities={communities}/>
                }/>
              </Switch>
          }
        </main>
        <Route exact path="/c/:c" render={() =>
          <footer className="app__footer">
            <Nav.Camera to="/camera" alt="New GIF" />
          </footer>
        } />
      </div>
    </Router>
  }
}

const Invite = props => {
  const { communities } = props
  let i = ''
  try {
    i = atob(props.match.params.code)
  } catch(e) {
    console.log('No invite for you with this code')
  }
  const d = new Date(parseInt(i.substr(0,13),10))
  const t = new Date()
  if ((t.getTime() - d.getTime()) < 24 * 60 * 60 * 1000) {
    const c = atob(i.substr(13))
    console.log(`Congratulations, you got your invite to ${c}`)
    set('communities', communities.filter(x => x !== c).concat(c))
      .then(() => props.history.push(`/c/${c}`))
  }
  return <div>This code is not valid</div>
}

const LOADING = 'fetching the data'
const NOT_ALLOWED = 'user has not been invited to the community and it is not public'
const LOADED = 'data has been loaded, updates will be received'

class Community extends Component {

  state = { mode: LOADING, data: initialState }

  componentDidMount() {
    db.on('update', this.fetchData)
    this.fetchData()
  }

  componentWillUnmount() {
    db.off('update', this.fetchData)
  }

  fetchData = () => {
    const c = this.props.match.params.c
    if (c.indexOf('public-') === 0 || this.props.communities.includes(c)) {
      db.fetchData(c)
        .then(data => this.setState({ mode: LOADED, data }))
    } else {
      this.setState({ mode: NOT_ALLOWED })
    }
  }

  render() {
    if(this.state.mode === LOADING) {
      return <div>Spinner</div>
    }

    if (this.state.mode === NOT_ALLOWED) {
      return <div>Not Allowed</div>
    }

    return <Stream {...this.state.data}/>
  }
}

const generateCode = (c) => {
  const t = new Date()
  console.log(btoa(t.getTime() + btoa(c)))
}

export default App
