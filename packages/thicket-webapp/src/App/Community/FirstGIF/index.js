import React, { Component } from 'react'
import Modal from '../../../components/Modal'
import { Button } from 'thicket-elements'
import store from '../../../database/store'
import './FirstGIF.css'

const { user, communities } = store

const close = cb =>
  user.put({ hasDoneFirstGIF: true }).then(cb)

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

  update = () =>
    communities.get(this.props.community).then(community => community.put({ title: this.state.title }))

}

const Header = () => <header className="firstgif__header">
  <h3>Welcome to Thicket Communities</h3>
</header>

const Main = props => {
  const { title, community } = props
  const link = window.location.origin + '/c/' + community + '?token=' + btoa(community)
  return <div className="firstgif__main">
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
        <input type="text" value={link} readOnly />
      </label>
      <aside>
        NOTE: Anyone with this link can join and contribute content. Only send to reliable users and do not post publically.
      </aside>
    </div>
  </div>
}

const Footer = props => <footer className="firstgif__footer">
  <Button onClick={props.onClose}>Close</Button>
</footer>

const FirstGIF = props => <Modal
  header={<Header />}
  footer={<Footer onClose={() => close(props.onClose)} />}
  onClose={() => close(props.onClose)}>
    <Main {...props} />
  </Modal>

export default FirstGIF
