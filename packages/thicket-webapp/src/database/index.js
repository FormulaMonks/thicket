import IPFS from 'ipfs'
import { Buffer } from 'safe-buffer'
import ImageDataConverter from '../utils/imageDataConverter'
import Y from 'yjs'
import yMemory from 'y-memory'
import yIndexeddb from 'y-indexeddb'
import yArray from 'y-array'
import yIpfsConnector from 'y-ipfs-connector'

const SAVE_SUCCESS = 'DatabaseSaveSuccessEvent'
const SAVE_FAIL = 'DatabaseSaveFailEvent'

Y.extend(yMemory, yArray, yIpfsConnector, yIndexeddb)

class Database {

  constructor(name, initialState) {
    this.id = name
    this.initialState = initialState
    this.initIpfsNode()
  }

  initIpfsNode = () => {
    if (!this.initPromise) {
      this.initPromise = new Promise((resolve, reject) => {
        this._node = new IPFS({
          repo: 'thicket',
          EXPERIMENTAL: {
            pubsub: true,
          },
        })

        this._node.once('ready', () => {
          Y({
            db: {
              name: 'indexeddb'
            },
            connector: {
              name: 'ipfs',
              room: 'thicket-pubsub-crdt',
              ipfs: this._node,
            },
            share: {
              publications: 'Array'
            }
          }).then(y => {
            this._y = y

            // new events local and/or peers
            y.share.publications.observe(event =>  {
              window.dispatchEvent(new CustomEvent(SAVE_SUCCESS))
            })
            // initial sync from local storage and/or other peers
            window.dispatchEvent(new CustomEvent(SAVE_SUCCESS))

            resolve(this._nodeInfo())
          })
        })

        this._node.on('error', err => {
          console.error('Error connecting the IPFS node: ', err)
          reject(err)
        })
      })
    }
    return this.initPromise
  }

  mapData(data) {
    return {
      publications: data.reduce((p, c) => {
        p[c.id] = {
          id: c.id,
          src: `https://ipfs.io/ipfs/${c.id}`,
        }
        return p
      }, {}),
      publicationOrder: data.sort((a, b) => b.createdAt - a.createdAt).map(x => x.id),
    }
  }

  fetchData() {
    return this.initIpfsNode()
      .then(({ y }) => this.mapData(y.share.publications.toArray()))
  }

  insert(str) {
    return new Promise((resolve, reject) => {
      this.addBase64File(str)
        .then(id => {
          this.initIpfsNode().then(({ y }) => {
            y.share.publications.push([{
              id,
              createdAt: Date.now(),
            }])

            resolve()
          })
        })
    })
  }

  remove(hash) {
    return new Promise((resolve, reject) => {
      this.initIpfsNode().then(({ y }) => {
        y.share.publications.delete(y.share.publications.toArray().findIndex(i => i.id === hash))
        resolve()
      })
    })
  }

  addBase64File = base64 => new Promise((resolve, reject) => {
    this.initIpfsNode().then(({ node }) =>
      node.files.add(Buffer.from(new ImageDataConverter(base64).convertToTypedArray()), (err, res) => {
        if (err) {
          console.error('Error publishing to IPFS: ', err)
          reject(err)
        }
        resolve(res[0].hash)
      }))
  })

  addSaveSuccessListener(func) {
    window.addEventListener(SAVE_SUCCESS, func, false)
  }

  removeSaveSuccessListener(func) {
    window.removeEventListener(SAVE_SUCCESS, func, false)
  }

  addSaveFailListener(func) {
    window.addEventListener(SAVE_FAIL, func, false)
  }

  removeSaveFailListener(func) {
    window.removeEventListener(SAVE_FAIL, func, false)
  }

  _nodeInfo = () => ({ node: this._node, y: this._y })
}

export default ({name, initialState}) => new Database(name, initialState)
