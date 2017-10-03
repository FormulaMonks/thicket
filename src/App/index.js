import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import Camera from './Camera'
import Stream from './Stream'
import Publication from './Publication'
import { Camera as IconCamera } from './NavLinks'
import './App.css'

import db from './syncedDB';

class App extends Component {

  componentDidMount() {
    db.addSaveSuccessListener(this.rerender)
    db.addSaveFailListener(this.handleDatabaseError)
  }

  componentWillUnmount() {
    db.removeSaveSuccessListener(this.rerender)
    db.addSaveFailListener(this.handleDatabaseError)
  }

  rerender = () => {
    this.forceUpdate();
  }

  handleDatabaseError = e => {
    console.error(e.detail)
    alert(e.detail.message)
  }

  render() {
    return <Router>
      <div className="app">
        <header className="app__header">Thicket</header>
        <main className="app__main">
          <Switch>
            <Route exact path="/" component={Stream} />
            <Route exact path="/camera" component={Camera} />
            <Route path="/:id" component={Publication} />
          </Switch>
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
