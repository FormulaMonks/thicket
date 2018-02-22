import React, { Component } from 'react'
import { Modal, Button, Styles } from 'thicket-elements'
import './Leave.css'

const { linearGradient } = Styles

export default class Leave extends Component {
  render() {
    const { title, onLeave, onCancel } = this.props
    return <Modal
      className="leave"
      disableBodyScroll
      style={{ background: linearGradient }}
    >
      <div className="leave__wrap">
        <h3>Leave Community?</h3>
        <div className="leave__msgs">Are you sure you want to leave the <span className="leave__community">"{title}"</span> Community?</div>
        <div className="leave__msgs">Note: You will no longer be able to view or contribute content to this Community. Content will remain in the Community, but you will need to be reinvited to rejoin.</div>
        <div className="leave__btns">
          <Button className="leave__btn" onClick={onLeave}>Leave Community</Button>
          <Button secondary onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </Modal>
  }
}
