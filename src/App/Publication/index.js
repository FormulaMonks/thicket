import React, { Component } from 'react'
import { getImage, deleteImage } from '../syncedDB'
import { Cancel as DeleteIcon } from '../NavLinks'
import placeholderPng from './placeholder.png'
import './Publication.css'

const Placeholder = () => <img className="publication__img" src={placeholderPng} alt="GIF placehodler" />

class Publication extends Component {

  state = { loaded: false, gif: null }

  componentWillMount() {
    getImage(this.props.match.params.id)
      .then(gif => this.setState({ gif, loaded: true }))
  }

  render() {
    const { loaded } = this.state
    const gif = loaded ?
      <img
        className="publication__img"
        src={this.state.gif.src}
        alt="" />
      : <Placeholder />

    return <div className="publication">
      <div className="publication__content">
        {gif}
      </div>
      <div className="publication__controls">
        {loaded && <DeleteIcon onClick={this.delete(this.props.match.params.id)} alt="Delete GIF" />}
      </div>
    </div>
  }

  delete = id => () => {
    deleteImage(id)
      .then(() => this.props.history.push('/'))
  }
}

export default Publication
