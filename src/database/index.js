import IPFS from 'ipfs'
import { Buffer } from 'safe-buffer'
import { loadState, saveState } from './localStorage'
import { decode } from 'base64-arraybuffer'

const SAVE_SUCCESS = 'DatabaseSaveSuccessEvent'
const SAVE_FAIL = 'DatabaseSaveFailEvent'

class Database {

  constructor(name, initialState) {
    this.id = name
    this.initialState = initialState
    this.initIpfsNode()
  }

  initIpfsNode = () => {
    return new Promise((resolve, reject) => {

      if (this.ipfsNode) resolve(this.ipfsNode)

      // todo:
      // this is where we can room/namespace/channel
      const node = new IPFS({ repo: 'thicket' })
      node.on('ready', () => {
        this.ipfsNode = node
        resolve(this.ipfsNode)
      })
      node.on('error', err => {
        console.error('Error connecting the IPFS node: ', err)
        reject(err)
      })
    })
  }

  fetchData() {
    return loadState(this.id)
      .then(res => res || this.initialState)
  }

  setData(newData)  {
    saveState(this.id, newData)
      .then(() => window.dispatchEvent(new CustomEvent(SAVE_SUCCESS, { detail: newData} )))
      .catch(err => window.dispatchEvent(new CustomEvent(SAVE_FAIL, { detail: err })))
  }

  addBase64File = base64 => new Promise((resolve, reject) => {
    this.initIpfsNode().then(node =>
      node.files.add(Buffer.from(decode(base64)), (err, res) => {
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
}

export default ({name, initialState}) => new Database(name, initialState)
