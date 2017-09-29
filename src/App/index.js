import React, { Component } from 'react'
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

  state = { shoot: false }

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
    const { shoot } = this.state
    const { image } = db.fetchData()
    return [
      <header key="header" className="header">Thicket</header>,
      <main key="main" className="main">
        {shoot && <Giffer
          onSave={saveImage}
          image={image}
          onCancel={() => this.setState({ shoot: false })}
        />}
      </main>,
      <footer key="footer" className={`footer${shoot ? ' footer--inactive' : ''}`}>
        <IconCamera onClick={() => this.setState({ shoot: true })} alt="New GIF" />
      </footer>
    ]
  }
}

export default App
