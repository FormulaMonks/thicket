import React, { Component } from 'react'
import { Button } from 'thicket-elements'
import Close from '../../../components/Close'
import localForage from 'localforage'
import db from '../../../database'
import './FirstGIF.css'

const close = cb => {
  localForage.setItem('hasDoneFirstGIF', true).then(cb)
}

class Title extends Component {
  constructor(props) {
    super(props)
    this.state = { title: props.title }
  }

  componentWillReceiveProps(props) {
    this.setState({ title: props.title })
  }

  render() {
    return [
      <input key="input" type="text" onChange={e => this.setState({ title: e.currentTarget.value })} value={this.state.title} />,
      <Button key="button" onClick={this.update}>Update</Button>,
    ]
  }

  update = () => {
    db.metadata.post(this.props.community, { title: this.state.title })
  }
}

const FirstGIF = props => {
  const { title } = props
  return <div className="firstgif">
    <div className="firstgif__wrap">
      <div className="firstgif__close">
        <Close onClick={() => close(props.onClose)} />
      </div>
      <div className="firstgif__modal">
        <header className="firstgif__header">
          <h3>Welcome to Thicket Communities</h3>
        </header>
        <main className="firstgif__main">
          <h4 className="firstgif__message">
            Awesome, you shot your first GIF! We automatically added it to a new Community called "{title}".
          </h4>
          <div className="firstgif__body">
            <label className="firstgif__label">
              <div>
                Update your community title if you’d like:
              </div>
              <Title title={title} community={props.community} />
            </label>
            <label className="firstgif__label">
              <div>Or copy the Community Invite Link below and share with friends so they can create and add content:</div>
              <input type="text" value="tbd" readOnly />
            </label>
            <aside>
              NOTE: Anyone with this link can join and contribute content. Only send to reliable users and do not post publically.
            </aside>
          </div>
        </main>
        <footer className="firstgif__footer">
          <Button onClick={() => close(props.onClose)}>Close</Button>
        </footer>
      </div>
    </div>
  </div>
}

export default FirstGIF
