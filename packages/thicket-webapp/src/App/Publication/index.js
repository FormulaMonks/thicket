import React from 'react'
import { deleteImage } from '../syncedDB'
import { Cancel as DeleteIcon } from '../NavLinks'
import './Publication.css'
import { homepage } from '../../../package.json'

const twitterURL = 'https://twitter.com/intent/tweet'
const facebookURL = 'https://www.facebook.com/sharer.php'

const del = (history, id) => () => {
  deleteImage(id)
    .then(() => history.replace('/'))
}

export default ({publications, match, history}) => {
  const id = match.params.id
  const gif = publications[id]
  const url = `${homepage}/${id}`

  return <div className="publication">
    <div className="publication__content">
      <img
        className="publication__img"
        src={gif && gif.src}
        alt=""
      />
    </div>
    <div>
      <a href={`${twitterURL}?url=${url}`} target="_blank">tweet this</a>
      <a href={`${facebookURL}?u=${url}`} target="_blank">post to facebook</a>
    </div>
    <div className="publication__controls">
      <DeleteIcon onClick={del(history, id)} alt="Delete GIF" />
    </div>
  </div>
}

