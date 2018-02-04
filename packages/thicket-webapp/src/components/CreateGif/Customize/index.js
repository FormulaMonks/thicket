import React, { Component } from 'react'
import { Styles, Button, Input, Modal } from 'thicket-elements'
import './Customize.css'

const { linearGradient } = Styles

class Customize extends Component {

  constructor(props) {
    super(props)
    this.state = { caption: '', nickname: props.nickname }
  }

  render() {
    return <Modal disableBodyScroll className="customize__modal">
      <div className="customize" style={{ background: linearGradient }}>
        <img
          className="customize__img"
          src={this.props.src}
          alt={this.state.caption}
        />
        <div className="customize__inner">
          <h2>Save your GIF!</h2>
          <label className="customize__label">
            Change nickname? <span className="customize__span">(Optional)</span>
            <Input value={this.state.nickname} onChange={e => this.setState({ nickname: e.target.value })} />
          </label>
          <label className="customize__label">
            Give your GIF a caption:
            <Input
              value={this.state.caption}
              onChange={e => this.setState({ caption: e.target.value })}
            />
          </label>
          <div className="customize__controls">
            <Button
              className="customize__submit"
              onClick={this.onSubmit}
            >
              Save
            </Button>
            <Button
              secondary
              onClick={this.props.onRetake}
            >
              Retake
            </Button>
            <Button
              secondary
              onClick={this.props.onCancel}
            >
              Cancel
            </Button>
        </div>
        </div>
      </div>
    </Modal>
  }

  onSubmit = () => {
    this.props.onSubmit({
      src: this.props.src,
      caption: this.state.caption,
      nickname: this.state.nickname
    })
  }
}

export default Customize
