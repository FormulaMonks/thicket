import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import Camera from './Camera'
import Stream from './Stream'
import Publication from './Publication'
import {
  Camera as IconCamera,
  Back as BackNav,
} from './NavLinks'
import Spinner from './Spinner'
import './App.css'

import db, { initialState } from './syncedDB';

class App extends Component {

  state = { ...initialState, loaded: false }

  componentDidMount() {
    db.addSaveSuccessListener(this.rerender)
    db.addSaveFailListener(this.handleDatabaseError)

    db.fetchData()
      .then(data => this.setState({ loaded: true, ...data }))
  }

  componentWillUnmount() {
    db.removeSaveSuccessListener(this.rerender)
    db.addSaveFailListener(this.handleDatabaseError)
  }

  rerender = ev => {
    this.setState({ ...ev.detail })
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
            : [
              <Route key="stream" path="/" render={({ location }) =>
                <Stream {...data} inactive={location.pathname !== '/'}/>
              }/>,
              <Switch key="switch">
                <Route exact path="/camera" component={Camera} />,
                <Route path="/:id" render={props =>
                  <Publication {...props} {...data} />
                }/>
              </Switch>
            ]
          }
        </main>
        <Route exact path="/" render={() =>
          <footer className="app__footer">
            <IconCamera to="/camera" alt="New GIF" />
          </footer>
        } />
      </div>
    </Router>
  }
}

export default App
