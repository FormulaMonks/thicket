import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import Camera from './Camera'
import { Camera as IconCamera } from './Icons'
import './App.css'

import db from './syncedDB';

class App extends Component {

  componentDidMount() {
    db.addSaveSuccessListener(this.rerender);
  }

  componentWillUnmount() {
    db.removeSaveSuccessListener(this.rerender);
  }

  rerender = () => {
    this.forceUpdate();
  }

  render() {
    return <Router>
      <div className="app">
        <header className="app__header">Thicket</header>
        <main className="app__main">
          <Switch>
            <Route exact path="/" render={() => <div>Stream</div>} />
            <Route path="/camera" component={Camera} />
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
