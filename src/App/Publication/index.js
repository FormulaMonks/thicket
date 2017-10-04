import React from 'react'
import { deleteImage } from '../syncedDB'
import { Cancel as DeleteIcon } from '../NavLinks'
import './Publication.css'

const del = (history, id) => () => {
  deleteImage(id)
    .then(() => history.replace('/'))
}

export default ({publications, match, history}) => {
  const id = match.params.id
  const gif = publications[id]

  return <div className="publication">
    <div className="publication__content">
      <img
        className="publication__img"
        src={gif && gif.src}
        alt=""
      />
    </div>
    <div className="publication__controls">
      <DeleteIcon onClick={del(history, id)} alt="Delete GIF" />
    </div>
  </div>
}
