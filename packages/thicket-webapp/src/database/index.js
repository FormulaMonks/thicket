import IPFS from 'ipfs'
import Room from 'ipfs-pubsub-room'
import { Buffer } from 'safe-buffer'
import ImageDataConverter from '../utils/imageDataConverter'
import { loadState, saveState } from './localStorage'

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

      if (this.ipfsNode) return resolve(this._nodeInfo())

      const node = new IPFS({
        repo: 'thicket',
        EXPERIMENTAL: {
          pubsub: true,
        },
        config: {
          Addresses: {
            Swarm: [
              "/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star"
            ],
            API: '',
            Gateway: ''
          },
          Bootstrap: [
            "/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
            "/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
            "/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
            "/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
            "/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64",
            "/dns4/wss0.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic",
            "/dns4/wss1.bootstrap.libp2p.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6"
          ],
        },
      })

      node.once('ready', () => node.id((err, info) => {
        this.ipfsNode = node
        this.room = Room(node, 'thicket-pubsub')

        this.room.on('message', message => {
          if (message.from !== info.id) {
            this.setData(JSON.parse(message.data), false)
          }
        })

        this.room.on('peer joined', peer => {
          this.fetchData()
            .then(data => this.room.sendTo(peer, JSON.stringify(data)))
        })

        resolve(this._nodeInfo())
      }))

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

  setData(newData, _broadcast = true)  {
    if (_broadcast) {
      this.initIpfsNode().then(({room}) => room.broadcast(JSON.stringify(newData)))
    }

    saveState(this.id, newData)
      .then(() => window.dispatchEvent(new CustomEvent(SAVE_SUCCESS, { detail: newData} )))
      .catch(err => window.dispatchEvent(new CustomEvent(SAVE_FAIL, { detail: err })))
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

  _nodeInfo = () => ({ node: this.ipfsNode, room: this.room })
}

export default ({name, initialState}) => new Database(name, initialState)
