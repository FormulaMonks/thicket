import React from 'react'
import { deleteImage } from '../syncedDB'
import { BottomNav as Nav } from 'thicket-elements'
import './Publication.css'
import { homepage } from '../../../package.json'

const twitterURL = 'https://twitter.com/intent/tweet'
const facebookURL = 'https://www.facebook.com/sharer.php'

const del = (history, id) => () => {
  deleteImage(id)
    .then(() => history.replace('/'))
}

export default ({ match, history }) => {
  const id = match.params.id
  const url = `${homepage}/gif/${id}`

  return <div className="publication">
    <div className="publication__content">
      <img
        className="publication__img"
        src={`https://ipfs.io/ipfs/${id}`}
        alt=""
      />
    </div>
    <div>
      <a href={`${twitterURL}?url=${url}`} target="_blank">tweet this</a>
      <a href={`${facebookURL}?u=${url}`} target="_blank">post to facebook</a>
    </div>
    <div className="publication__controls">
      <Nav.Cancel onClick={del(history, id)} alt="Delete GIF" />
    </div>
  </div>
}

