// This is the database that we will sync across clients using IPFS or some
// other tech. We can later create a per-client database for UI state & other
// such data, if convenient.

import createDatabase from '../database';

const initialState = {
  image: '',
}

const db = createDatabase({initialState})

export default db

export const saveImage = str => {
  db.setData({ image: str });
}
