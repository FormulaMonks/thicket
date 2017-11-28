import React, { Component } from 'react'
import Modal from '../../../components/Modal'
import Gif from '../../../components/Gif'
import { Button } from 'thicket-elements'
import store from '../../../database/store'
import './Publication.css'

const { user, communities } = store

const Header = () =>
  <header className="publication__header">View / Edit your GIF</header>

const Footer = props => <footer className="publication__footer">
  <Button onClick={props.onDelete}>Delete GIF</Button>
  <Button onClick={props.onSave}>Save Changes</Button>
</footer>

class Publication extends Component {

  state = { gif: null, showDeleteConfimation: false, modified: false }

  async componentDidMount() {
    const { publications } = await communities.get(this.props.match.params.c)
    publications.on('update', this.fetch)
    this.fetch()
  }

  async componentWillUnmount() {
    const { publications } = await communities.get(this.props.match.params.c)
    publications.off('update', this.fetch)
  }

  render() {
    const { gif } = this.state

    if (!gif) {
      return null
    }

    if (this.state.showDeleteConfimation) {
      return <Modal
        header="Confirm Delete GIF"
        footer={<div>
            <Button onClick={() => this.setState({ showDeleteConfimation: false })}>Cancel</Button>
            <Button onClick={this.onDelete}>Confirm</Button>
          </div>}
        onClose={() => this.setState({ showDeleteConfimation: false })}>
        <div>Are you sure you want to delete this GIF:</div>
        <div>{gif.caption}</div>
        <div>NOTE: this action cannot be undone</div>
      </Modal>
    }

    return (
      <Modal
        header={<Header />}
        footer={<Footer onSave={this.onSave} onDelete={() => this.setState({ showDeleteConfimation: true })} />}
        onClose={this.close}
      >
        <Gif
          communityId={this.props.match.params.c}
          gif={this.state.gif}
          editable
          onChange={gif => this.setState({ gif, modified: true })}
        />
      </Modal>
    )
  }

  close = () => this.props.history.push(`/c/${this.props.match.params.c}`)

  fetch = async () => {
    const { c, id } = this.props.match.params
    const { publications } = await communities.get(c)
    const gif = await publications.get(id)
    this.setState({ gif })
  }

  onDelete = async () => {
    const { c, id } = this.props.match.params
    const { publications } = await communities.get(c)
    await publications.delete(id)
    this.close()
  }

  onSave = async () => {
    if (!this.state.modified) {
      this.close()
      return
    }

    const { c, id } = this.props.match.params
    const { publications } = await communities.get(c)
    const { gif } = this.state
    await publications.put(id, gif)
    await user.put({ nickname: gif.nickname })
    this.close()
  }

}

export default Publication
