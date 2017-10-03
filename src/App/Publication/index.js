import React, { Component } from 'react'
import { getImage, deleteImage } from '../syncedDB'
import { Cancel as BackNav, Cancel as DeleteIcon } from '../NavLinks'
import './Publication.css'

const Placeholder = () => <img src="" alt="GIF placehodler" />

class Publication extends Component {

  state = { loaded: false, gif: null }

  componentWillMount() {
    getImage(this.props.match.params.id)
      .then(gif => this.setState({ gif, loaded: true }))
  }

  render() {
    const { loaded } = this.state
    const gif = loaded ? <img src={this.state.gif.src} alt="" /> : <Placeholder />
    return <div className="publication">
      <div className="publication__content">
        {gif}
      </div>
      <div className="publication__controls">
        {loaded && <DeleteIcon onClick={this.delete(this.props.match.params.id)} alt="Delete GIF" />}
        <BackNav to="/" alt="Back" />
      </div>
    </div>
  }

  delete = id => () => {
    deleteImage(id)
      .then(() => this.props.history.push('/'))
  }
}

export default Publication
