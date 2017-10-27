import IPFS from 'ipfs'
import { Buffer } from 'safe-buffer'
import ImageDataConverter from '../utils/imageDataConverter'
import Y from 'yjs'
import yMemory from 'y-memory'
import yIndexeddb from 'y-indexeddb'
import yArray from 'y-array'
import yIpfsConnector from 'y-ipfs-connector'
import CID from 'cids'
import pull from 'pull-stream'
import concat from 'concat-stream'
import pullPromise from 'pull-promise'

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
          config: {
            Addresses: {
              Swarm: ['/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star'],
              API: '',
              Gateway: '',
            },
            Bootstrap: [
              '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
              '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
              '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
              '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
              '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
              '/dns4/wss0.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
              '/dns4/wss1.bootstrap.libp2p.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
            ],
          },
        })

        this._node.once('ready', () => {
          Y({
            db: {
              name: 'indexeddb',
            },
            connector: {
              name: 'ipfs',
              room: 'thicket-pubsub-crdt',
              ipfs: this._node,
            },
            share: {
              publications: 'Array',
            },
          }).then(y => {
            this._y = y

            // new events local and/or peers
            y.share.publications.observe(event => {
              // todo: if delete remove local files
              // todo: if insert add to local files
              window.dispatchEvent(new CustomEvent(SAVE_SUCCESS))
            })
            // initial sync from local storage and/or other peers
            // todo: review how events behave if the users has been disconnected for a while
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
        p[c.id] = c
        return p
      }, {}),
      publicationOrder: data
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(x => x.id),
    }
  }

  toBase64(src) {
    return `data:image/gif;base64,${btoa(new Uint8Array(src).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`
  }

  fetchData() {
    return new Promise((resolve, reject) => {
      this.initIpfsNode().then(({ node, y }) => {
        pull(
          pull.values(y.share.publications.toArray()),
          pullPromise.through(p => node.files.cat(p.id).then(stream => { return { ...p, stream }})),
          pullPromise.through(({ stream, ...rest }) => new Promise(r => stream.pipe(concat(src => r({ ...rest, src }))))),
          pull.map(obj => ({ ...obj, src: this.toBase64(obj.src) })),
          pull.collect((err, res) => resolve(this.mapData(res))),
        )
      })
    })
  }

  insert(str) {
    return new Promise((resolve, reject) => {
      this.addBase64File(str).then(id => {
        this.initIpfsNode().then(({ y }) => {
          y.share.publications.push([
            {
              id,
              createdAt: Date.now(),
            },
          ])

          resolve()
        })
      })
    })
  }

  remove(hash) {
    return new Promise((resolve, reject) => {
      this.initIpfsNode().then(({ node, y }) => {
        // unlink local storage
        // first all blocks from this hash
        node.dag.get(new CID(hash), (err, res) => {
          pull(
            pull.values(res.value.links),
            pull.map(i => new CID(i.multihash)),
            pull.drain(
              i => node._ipldResolver.bs.delete(i),
              () => {
                // then the actual hash
                node._ipldResolver.bs.delete(new CID(hash), () => {
                  // broadcast to the world
                  y.share.publications.delete(
                    y.share.publications
                      .toArray()
                      .findIndex(i => i.id === hash),
                  )
                  // done
                  resolve()
                })
              },
            ),
          )
        })
      })
    })
  }

  addBase64File = base64 =>
    new Promise((resolve, reject) => {
      this.initIpfsNode().then(({ node }) =>
        node.files.add(
          Buffer.from(new ImageDataConverter(base64).convertToTypedArray()),
          (err, res) => {
            if (err) {
              console.error('Error publishing to IPFS: ', err)
              reject(err)
            }
            resolve(res[0].hash)
          },
        ),
      )
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

export default ({ name, initialState }) => new Database(name, initialState)
