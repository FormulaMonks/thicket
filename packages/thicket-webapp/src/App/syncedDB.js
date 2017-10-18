// This is the database that we will sync across clients using IPFS or some
// other tech. We can later create a per-client database for UI state & other
// such data, if convenient.

import createDatabase from '../database'

export const initialState = {
  publications: {},
  publicationOrder: [],
}

const db = createDatabase({name: 'syncedDB', initialState})

export default db

export const saveImage = str => db.insert(str)

export const deleteImage = id => db.remove(id)
