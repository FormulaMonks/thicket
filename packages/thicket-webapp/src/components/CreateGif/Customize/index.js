import React, { Component } from 'react'
import { Button, Input } from 'thicket-elements'
import './Customize.css'

class Customize extends Component {

  constructor(props) {
    super(props)
    this.state = { caption: '', nickname: props.nickname }
  }

  render() {
    return <div className="customize">
      <h2 key="title">Save your GIF</h2>
      <div className="customize__preview" key="preview">
        <img className="customize__img" src={this.props.src} alt={this.state.caption} />
        <div className="customize__inputs">
          <label className="customize__label">
            Use a different nickname? <span className="customize__span">(Optional)</span>
            <Input value={this.state.nickname} onChange={e => this.setState({ nickname: e.target.value })} />
          </label>
          <label className="customize__label">
            Give your GIF a caption:
            <Input value={this.state.caption} onChange={e => this.setState({ caption: e.target.value })} />
          </label>
        </div>
      </div>
      <div className="customize__controls" key="controls">
        <Button className="customize__cancel" onClick={this.props.onCancel}>Cancel</Button>
        <Button className="customize__submit" onClick={this.onSubmit}>Submit</Button>
      </div>
    </div>
  }

  onSubmit = () => {
    this.props.onSubmit({ src: this.props.src, caption: this.state.caption, nickname: this.state.nickname })
  }
}

export default Customize
