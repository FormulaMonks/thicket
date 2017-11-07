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

const GIF = 'show GIF'
const DOWNLOAD = 'show options for downloading'
const SHARE = 'show options for link sharing'
const DELETE = 'show confirm box for gif deletion'

const Header = () =>
  <header className="publication__header">View / Edit your GIF</header>

const Footer = props => <footer className="publication__footer">
  <Button onClick={props.onDelete}>Delete GIF</Button>
  <Button onClick={props.onSave}>Save Changes</Button>
</footer>

class Main extends Component {

  state = { mode: GIF }

  render() {
    if (!this.props.gif) {
      return <div className="publication__main"><Spinner /></div>
    }

		const { mode } = this.state
    const { gif, onChange } = this.props
    const { src, nickname, caption, id } = gif

    return <div className="publication__main">
      {mode === GIF && <img src={src} alt={caption} />}
      {mode === DOWNLOAD && <div>
        <div>
          <div>Download</div>
          <div><Button onClick={() => this.setState({ mode: GIF })}>x</Button></div>
        </div>
        <div>
          <input type="text" value={`https://ipfs.io/ipfs/${id}`} />
          <Button>Download</Button>
        </div>
      </div>}
      {mode === SHARE && <div>
        <div>
          <div>Share</div>
          <div><Button onClick={() => this.setState({ mode: GIF })}>x</Button></div>
        </div>
        <div>IPFS</div>
         <input type="text" value={`https://ipfs.io/ipfs/${id}`} readOnly />
        <div>This link</div>
         <input type="text" value={`${window.location.href}`} readOnly />
      </div>}
      <div>
        <div>Created by:</div>
        <Editable value={nickname} onChange={e => onChange({ ...gif, nickname: e.currentTarget.value })} />
        <div>GIF caption:</div>
        <Editable value={caption} onChange={e => onChange({ ...gif, caption: e.currentTarget.value })} />
        <div>Share GIF</div>
        <div>
          <img src={download} alt="Download" onClick={() => this.setState({ mode: DOWNLOAD })} />
          <img src={share} alt="Links" onClick={() => this.setState({ mode: SHARE })} />
          <img src={facebook} alt="Facebook" />
          <img src={twitter} alt="Twitter" />
        </div>
      </div>
    </div>
  }
}

class Publication extends Component {

  state = { gif: null, mode: null, modified: false }

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
      main={<Main gif={this.state.gif} onChange={gif => this.setState({ gif, modified: true })} />}
      footer={<Footer onSave={this.onSave} onDelete={() => this.setState({ mode: DELETE })} />}
      onClose={this.close}
    />
  }

  close = () => this.props.history.push(`$/c/${this.props.match.params.c}`)

  onDelete = () => {
    const { c, id } = this.props.match.params
    db.publications.delete(c, id).then(this.close)
  }

  onSave = () => {
    if (!this.state.modified) {
      this.close()
      return
    }

    const { c, id } = this.props.match.params
    db.publications.put(c, id, this.state.gif).then(this.close)
  }

}

export default Publication
