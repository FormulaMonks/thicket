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

  componentDidMount() {
    communities.get(this.props.match.params.c).then(({ publications }) =>
      publications.on('update', this.fetch))
    this.fetch()
  }

  componentWillUnmount() {
    communities.get(this.props.match.params.c).then(({ publications }) =>
      publications.off('update', this.fetch))
  }

  render() {
    if (this.state.showDeleteConfimation) {
      return <Modal
        header="Confirm Delete GIF"
        footer={<div>
            <Button onClick={() => this.setState({ showDeleteConfimation: false })}>Cancel</Button>
            <Button onClick={this.onDelete}>Confirm</Button>
          </div>}
        onClose={() => this.setState({ showDeleteConfimation: false })}>
        <div>Are you sure you want to delete this GIF:</div>
        <div>{this.state.gif.caption}</div>
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

  fetch = () => {
    const { c, id } = this.props.match.params
    communities.get(c).then(({ publications }) => publications.get(id)
        .then(gif => this.setState({ gif })))
  }

  onDelete = () => {
    const { c, id } = this.props.match.params
    communities.get(c).then(({ publications }) => publications.delete(id).then(this.close))
  }

  onSave = () => {
    if (!this.state.modified) {
      this.close()
      return
    }

    const { c, id } = this.props.match.params
    communities.get(c).then(community =>
      community.publications.put(id, this.state.gif)
        .then(() => user.put({ nickname: this.state.gif.nickname }))
        .then(this.close))
  }

}

export default Publication
