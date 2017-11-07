import React, { Component } from 'react'
import Modal from '../Modal'
import { Button, Spinner } from 'thicket-elements'
import db from '../../database'
import Editable from './Editable'
import './Publication.css'
import download from './download.svg'
import share from './share.svg'
import facebook from './facebook.svg'
import twitter from './twitter.svg'

const DOWNLOAD = 'show options for downloading'
const LINKS = 'show options for link sharing'
const DELETE = 'show confirm box for gif deletion'

const Header = () =>
  <header className="publication__header">View / Edit your GIF</header>

const Footer = props => <footer className="publication__footer">
  <Button onClick={props.onDelete}>Delete GIF</Button>
  <Button onClick={props.onSave}>Save Changes</Button>
</footer>

class Main extends Component {

  state = { mode: null }

  render() {
    if (!this.props.gif) {
      return <div className="publication__main"><Spinner /></div>
    }

    const { src, nickname, caption } = this.props.gif

    return <div className="publication__main">
      <img src={src} alt={caption} />
      <div>
        <div>Created by:</div>
        <Editable value={nickname} onChange={() => {}} />
        <div>GIF caption:</div>
        <Editable value={caption} onChange={() => {}} />
        <div>Share GIF</div>
        <div>
          <img src={download} alt="Download" />
          <img src={share} alt="Links" />
          <img src={facebook} alt="Facebook" />
          <img src={twitter} alt="Twitter" />
        </div>
      </div>
    </div>
  }
}

class Publication extends Component {

  state = { gif: null, mode: null }

  componentDidMount() {
    const { c, id } = this.props.match.params
    db.publications.get(c, [id])
      .then(arr => arr[0])
      .then(gif => this.setState({ gif }))
  }

  render() {
    const { mode } = this.state

    if (mode === DELETE) {
      return <Modal
        header={<div>Confirm Delete GIF</div>}
        main={<div>
            <div>Are you sure you want to delete this GIF:</div>
            <div>{this.state.gif.nickname}</div>
            <div>NOTE: this action cannot be undone</div>
          </div>}
        footer={<div>
            <Button onClick={() => this.setState({ mode: null })}>Cancel</Button>
            <Button onClick={this.onDelete}>Confirm</Button>
          </div>}
        onClose={() => this.setState({ mode: null })}
      />
    }

    return <Modal
      header={<Header />}
      main={<Main gif={this.state.gif} />}
      footer={<Footer onSave={this.onSave} onDelete={() => this.setState({ mode: DELETE })} />}
      onClose={this.close}
    />
  }

  close = () => this.props.history.push(`$/c/${this.props.match.params.c}`)

  onDelete = () => {
    const { c, id } = this.props.match.params
    db.publications.delete(c, id).then(this.close)
  }

  onSave = () => {}

}

export default Publication
