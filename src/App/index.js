import React, { Component } from 'react'
import classname from 'classname'
import Giffer from './Giffer'
import './App.css'
import cameraIcon from './camera.png'

import createDatabase from '../database';

const initialState = {
  image: '',
};

const db = createDatabase({initialState});

const saveImage = str => {
  db.setData({ image: str });
}

class App extends Component {

  state = { status: '' }

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
    const { status } = this.state
    const { image } = db.fetchData()
    const footerStyles = classname('footer', { 'footer-active': status !== 'shoot' })
    return (
      <div className="app">
        <div className="header">Thicket</div>
        <div className="content">
          <div className={classname('giffer-wrapper', { 'giffer-wrapper-active': status === 'shoot' })}>
            <Giffer
              onSave={saveImage}
              image={image}
              onCancel={() => this.setState({ status: '' })}
            />
          </div>
        </div>
        <div className={footerStyles}>
          <div className="camera-icon-wrapper" onClick={() => this.setState({ status: 'shoot' })}>
            <img className="camera-icon" src={cameraIcon} alt="New GIF" />
          </div>
        </div>
      </div>
    )
  }
}

export default App
