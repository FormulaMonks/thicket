// This is the database that we will sync across clients using IPFS or some
// other tech. We can later create a per-client database for UI state & other
// such data, if convenient.

import createDatabase from '../database';
import uuid from 'uuid/v4';

const initialState = {
  publications: {},
  publicationOrder: [],
}

const db = createDatabase({initialState})

export default db

export const saveImage = str => {
  const data = db.fetchData()
  const id = uuid()

  db.setData({
    ...data,
    publications: {
      ...data.publications,
      [id]: { id, src: str },
    },
    publicationOrder: [ id, ...data.publicationOrder ],
  })
}
