import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Gif from '../../../components/Gif'
import { Modal, Button } from 'thicket-elements'
import store from '../../../database/store'
import backSvg from '../../../images/arrow-left.svg'
import './Publication.css'

const { user, communities } = store

class Publication extends Component {

  state = { gif: null, showDeleteConfimation: false, modified: false }

  async componentDidMount() {
    const { publications } = await communities.get(this.props.match.params.c)
    publications.on('update', this.fetch)
    this.fetch()
    window.scrollTo(0, 0)
  }

  async componentWillUnmount() {
    const { publications } = await communities.get(this.props.match.params.c)
    publications.off('update', this.fetch)
  }

  render() {
    const { title, match } = this.props
    const { c } = match.params
    const { gif } = this.state

    if (!gif) {
      return null
    }

    if (this.state.showDeleteConfimation) {
      return <Modal>
        <div>Confirm Delete GIF</div>
        <div>Are you sure you want to delete this GIF:</div>
        <div>{gif.caption}</div>
        <div>NOTE: this action cannot be undone</div>
        <div>
          <Button onClick={() => this.setState({ showDeleteConfimation: false })}>Cancel</Button>
          <Button onClick={this.onDelete}>Confirm</Button>
        </div>
      </Modal>
    }

    return [
      <Link key="link" className="publication__link" to={`/c/${c}`}>
        <img src={backSvg} alt={`Back to ${title}`} /> <span className="publication__title">{title}</span>
      </Link>,
      <Modal key="modal">
        <Gif
          communityId={c}
          gif={this.state.gif}
          editable
          onChange={gif => this.setState({ gif, modified: true })}
        >
          <div className="publication__btns">
            <Button className="publication__save" onClick={this.onSave}>Save Changes</Button>
            <Button secondary onClick={() => this.setState({ showDeleteConfimation: true })}>Delete GIF</Button>
          </div>
        </Gif>
      </Modal>,
    ]
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
    const community = await communities.get(c)
    await community.deletePublication(id)
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
