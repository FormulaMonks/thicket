import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import Giffer from './Giffer'
import { Camera as IconCamera } from './Icons'
import './App.css'

import createDatabase from '../database';

const initialState = {
  image: '',
};

const db = createDatabase({initialState});

const saveImage = str => {
  db.setData({ image: str });
}

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
    const { image } = db.fetchData()
    return <Router>
      <div className="app">
        <header className="app__header">Thicket</header>
        <main className="app__main">
          <Switch>
            <Route exact path="/" render={() => <div>Stream</div>} />
            <Route exact path="/giffer" render={({ history }) =>
              <Giffer
                onSave={saveImage}
                image={image}
                onCancel={() => history.push('/') }
              />}
            />
          </Switch>
        </main>
        <Route exact path="/" render={() =>
          <footer className="app__footer">
            <Link to="/giffer">
              <IconCamera alt="New GIF" />
            </Link>
          </footer>
        } />
      </div>
    </Router>
  }
}

export default App
