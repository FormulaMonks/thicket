// This is the database that we will sync across clients using IPFS or some
// other tech. We can later create a per-client database for UI state & other
// such data, if convenient.

import ImageDataConverter from '../utils/imageDataConverter'
import createDatabase from '../database'
import IPFS from 'ipfs'
import { Buffer } from 'safe-buffer'

export const initialState = {
  publications: {},
  publicationOrder: [],
}

const db = createDatabase({name: 'syncedDB', initialState})
let node = null

export const init = cb => {
  // todo:
  // this is where we can room/namespace/channel
  node = new IPFS({ repo: 'thicket' })
  node.on('ready', cb)
  node.on('error', err => console.error('Error connecting the IPFS node: ', err))
}

export default db

export const saveImage = src => {
  return new Promise((resolve, reject) => {
    node.files.add(Buffer.from(new ImageDataConverter(src).convertToTypedArray()), (err, res) => {
      if (err) {
        console.error('Error publishing to IPFS: ', err)
        reject(err)
      }
      const id = res[0].hash
      db.fetchData()
        .then(data =>
          db.setData({
            ...data,
            publications: {
              ...data.publications,
              [id]: { id, src: `https://ipfs.io/ipfs/${id}`}
            },
            publicationOrder: [ id, ...data.publicationOrder ],
          }))
        .then(resolve)
    })
  })
}

export const deleteImage = id =>
  db.fetchData()
    .then(data => {
      const { [id]: p, ...rest } = data.publications
      db.setData({
        ...data,
        publications: rest,
        publicationOrder: data.publicationOrder.filter(i => i !== id)
      })
    })
