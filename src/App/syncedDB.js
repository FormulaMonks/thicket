// This is the database that we will sync across clients using IPFS or some
// other tech. We can later create a per-client database for UI state & other
// such data, if convenient.

import createDatabase from '../database'
import uuid from 'uuid/v4'

export const initialState = {
  publications: {},
  publicationOrder: [],
}

const db = createDatabase({name: 'syncedDB', initialState})

export default db

export const saveImage = str => {
  const id = uuid()

  return db.fetchData()
    .then(data =>
      db.setData({
        ...data,
        publications: {
          ...data.publications,
          [id]: { id, src: str },
        },
        publicationOrder: [ id, ...data.publicationOrder ],
      }))
}

export const deleteImage = id =>
  db.fetchData()
    .then(data => {
      delete data.publications[id]
      db.setData({
        ...data,
        publications: data.publications,
        publicationOrder: data.publicationOrder.filter(i => i !== id)
      })
    })
