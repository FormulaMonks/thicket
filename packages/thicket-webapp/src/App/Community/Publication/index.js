import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Gif from '../../../components/Gif'
import { Modal, Button } from 'thicket-elements'
import store from '../../../database/store'
import backSvg from '../../../images/arrow-left.svg'
import Delete from './Delete'
import './Publication.css'

const { communities } = store

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
      return <div ref={n => this.node = n}></div>
    }

    if (this.state.showDeleteConfimation) {
      return <Modal
        disableBodyScroll
        onClose={() =>this.setState({ showDeleteConfimation: false })}
      >
        <Delete
          ref={n => this.node = n}
          caption={gif.caption}
          onDelete={this.onDelete}
          onCancel={() => this.setState({ showDeleteConfimation: false })}
        />
      </Modal>
    }

    return [
      <Link
        key="link"
        ref={n => this.node = n}
        className="publication__link"
        to={`/c/${c}`}
      >
        <h3><img src={backSvg} alt={`Back to ${title}`} /> <span className="publication__title">{title}</span></h3>
      </Link>,
      <Modal
        key="modal"
        data-test="publication-modal"
        className="publication__modal"
        disableBodyScroll
        onClose={document.documentElement.clientWidth > 600 ? this.close : ()=>{} }
      >
        <Gif
          communityId={c}
          gif={this.state.gif}
          editable
          onChange={gif => this.setState({ gif, modified: true })}
          onShareHook={this.props.onShareHook}
        >
          <div className="publication__btns">
            <Button
              data-test="publication-save"
              className="publication__save"
              onClick={this.onSave}
            >
              Save Changes
            </Button>
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
    if (this.node) {
      this.setState({ gif })
    }
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
    this.close()
  }

}

export default Publication
