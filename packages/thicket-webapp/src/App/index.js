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

  state = { ...initialState, loaded: false, communities: [] }

  componentDidMount() {
    db.addSaveSuccessListener(this.fetchData)
    db.addSaveFailListener(this.handleDatabaseError)

    get('communities').then(data => this.setState({ communities: data || [] }))
    this.fetchData()
  }

  componentWillUnmount() {
    db.removeSaveSuccessListener(this.fetchData)
    db.addSaveFailListener(this.handleDatabaseError)
  }

  fetchData = () => {
    db.fetchData()
      .then(data => this.setState({ loaded: true, ...data }))
  }

  handleDatabaseError = e => {
    console.error(e.detail)
    alert(e.detail.message)
  }

  render() {
    const { loaded, ...data } = this.state

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
                      <Stream key="stream" {...data} />
                    ]
                  }
                }/>
                <Route exact path="/camera" component={Camera} />
                <Route exact path="/gif/:id" render={props =>
                  <Publication {...props} {...data} />
                }/>
                <Route exact path="/c/:c" render={props =>
                  <Community {...data} {...props}/>
                }/>
                <Route exact path="/invite/:code" render={props =>
                  <Invite {...props} communities={this.state.communities}/>
                }/>
              </Switch>
          }
        </main>
        <Route exact path="/" render={() =>
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
  let redirect = '/'
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

const Community = props => {
  const c = props.match.params.c
  const { publications } = props
  if (c.indexOf('public-') === 0 || props.communities.includes(c)) {
    const filtered = Object.keys(publications)
      .filter(x => publications[x].tags && publications[x].tags.includes(c))
      .map(x => publications[x])
    const pubs = filtered.reduce((p, c) => {
        p[c.id] = c
        return p
      }, {})
    const order = filtered.sort((a, b) => a.createdAt - a.createdAt)
      .map(x => x.id)

    return <div>
      <Stream publications={pubs} publicationOrder={order} />
    </div>
  }

  setImmediate(() => props.history.push('/'))
  return null
}

const generateCode = (c) => {
  const t = new Date()
  console.log(btoa(t.getTime() + btoa(c)))
}

export default App
