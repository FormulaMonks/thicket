// This is the database that we will sync across clients using IPFS or some
// other tech. We can later create a per-client database for UI state & other
// such data, if convenient.

import createDatabase from '../database'
import uuid from 'uuid/v4'

const initialState = {
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

export const getImage = id =>
  db.fetchData()
    .then(data => data.publications[id])

export const deleteImage = id =>
  db.fetchData()
    .then(data =>
      db.setData({
        ...data,
        publications: Object.keys(data.publications).reduce((p, c) => {
          if (c !== id) {
            p[c] = data.publications[c]
          }
          return p
        }, {}),
        publicationOrder: data.publicationOrder.filter(i => i !== id)
      }))
