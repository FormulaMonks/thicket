import IPFS from 'ipfs'
import CID from 'cids'
import ImageDataConverter from '../utils/imageDataConverter'
import Y from 'yjs'
import yMemory from 'y-memory'
import yIndexeddb from 'y-indexeddb'
import yArray from 'y-array'
import yMap from 'y-map'
import yIpfsConnector from 'y-ipfs-connector'
import EventEmitter from 'eventemitter3'
import pull from 'pull-stream'
import concat from 'concat-stream'
import pullPromise from 'pull-promise'
import pullSort from 'pull-sort'

const ipfsConfig = {
  repo: 'thicket',
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      Swarm: [
        '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star'
      ],
    },
    Bootstrap: [
      '/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmPFcnw8WYBGchAT7kJv2s8XiCkEAYUnkx5Zcw25RXwbip',
    ],
  },
}

const yConfig = (node, id) => ({
  db: {
    name: 'indexeddb'
  },
  connector: {
    name: 'ipfs',
    room: `thicket/${id}`,
    ipfs: node,
  },
  share: {
    publications: 'Array',
    publicationsMetadata: 'Map',
    metadata: 'Map'
  }
})

const toBase64 = src =>
  `data:image/gif;base64,${btoa(new Uint8Array(src).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`

const timedPromiseConcatStream = ({ hash, stream }) => {
  return new Promise((resolve, reject) => {
    let returned = false
    // timed fallback
    setTimeout(() => {
      if (!returned) {
        returned = true
        resolve({ hash, src: `https://ipfs.io/ipfs/${hash}` })
      }
    }, 1000)
    // or
    stream.pipe(concat(src => {
      if (!returned) {
        returned = true
        resolve({ hash, src: toBase64(src) })
      }
    }))
  })
}

class Database extends EventEmitter {
  constructor() {
    super()
    this._ipfs = null
    this._communities = new Map()
    this._initIPFS()
  }

  _initIPFS() {
    if (!this.ipfs) {
      this._ipfs = new Promise((resolve, reject) => {
        const node = new IPFS(ipfsConfig)
        node.once('ready', () => resolve(node))
      })
    }
    return this._ipfs
  }

  _initCommunity(communityId) {
    if (!communityId) {
      throw new Error('Please provide a Community Id')
    }
    if (!this._communities.has(communityId)) {
      this._communities.set(communityId, this._initIPFS().then(node =>
        Y(yConfig(node, communityId)).then(y => {
          y.share.metadata.observe(({ value }) => this.emit(`update-${communityId}`, value))
          y.share.publications.observe(() =>
            this._publicationsMap(communityId, y.share.publications.toArray()).then(data =>
              this.emit(`update-${communityId}-publications`, data)))
          y.share.publicationsMetadata.observe(({ value }) => this.emit(`update-${communityId}-publicationsMetadata`, value))

          return y
        })
      ))
    }
    return this._communities.get(communityId)
  }

  _unlink = (hash, cb = () => {}) =>
    // unlink from local storage
    this._initIPFS().then(node =>
      // all blocks from this hash
      node.dag.get(new CID(hash), (err, res) =>
        pull(
          pull.values(res.value.links),
          pull.map(i => new CID(i.multihash)),
          pull.drain(
            i => node._ipldResolver.bs.delete(i),
            // then the actual block for id
            () => node._ipldResolver.bs.delete(new CID(hash), cb)
          )
        )
      )
    )

  publicationsDelete = (communityId, id) => {
    return new Promise((resolve, reject) =>
      this._initCommunity(communityId).then(y => {
        y.share.publications.delete(y.share.publications.toArray().findIndex(p => p === id))
        this._unlink(id, resolve)
      })
    )}

  _publicationsMap = (communityId, data) => {
    return new Promise((resolve, reject) => {
      this._initCommunity(communityId).then(y => {
        this._initIPFS().then(node => {
          pull(
            pull.values(data),
            pullPromise.through(hash => node.files.cat(hash).then(stream => ({ hash, stream }))),
            //pullPromise.through(({ hash, stream }) => new Promise(r => stream.pipe(concat(src => r({ hash, src: toBase64(src) }))))),
            pullPromise.through(timedPromiseConcatStream),
            pull.map(({ hash, src }) => ({ id: hash, src, ...y.share.publicationsMetadata.get(hash) })),
            pullSort((a, b) => b.createdAt - a.createdAt),
            pull.collect((err, res) => resolve(res)),
          )
        })
      })
    })
  }

  publicationsGet = (communityId, id) =>
    this.publicationsGetAll(communityId, [id]).then(res => res[0])

  publicationsGetAll = (communityId, ids = []) =>
    this._initCommunity(communityId)
      .then(y => y.share.publications.toArray())
      .then(data => data.filter(id => !ids.length || ids.includes(id)))
      .then(data => this._publicationsMap(communityId, data))

  publicationsPost = (communityId, { src, ...data }) =>
    this._initIPFS().then(node =>
      node.files
        .add(Buffer.from(new ImageDataConverter(src).convertToTypedArray()))
        .then(res =>
          this._initCommunity(communityId).then(y => {
            const id = res[0].hash
            y.share.publications.push([id])
            y.share.publicationsMetadata.set(id, { ...data, createdAt: Date.now() })
          })
        )
      )

  publicationsPut = (communityId, id, data) =>
    this._initCommunity(communityId).then(y =>
      y.share.publicationsMetadata.set(id, { ...y.share.publicationsMetadata.get(id), ...data }))

  communityDelete = communityId =>
    this._initCommunity(communityId).then(y => {
      // async remove all local publications
      y.share.publications.toArray().forEach(hash => this._unlink(hash))
      // leave room
      return y.destroy()
    })

  communityGet = communityId =>
    this._initCommunity(communityId)
      .then(y => y.share.metadata.get(communityId))
      .then(data => ({ id: communityId, title: '', ...data }))

  communityPost = (communityId, data) =>
    this._initCommunity(communityId).then(y => y.share.metadata.set(communityId, { ...data, createdAt: Date.now() }))

  communityPut = (communityId, data) =>
    this._initCommunity(communityId).then(y => y.share.metadata.set(communityId, { ...y.share.metadata.get(communityId), ...data }))
}

Y.extend(yMemory, yArray, yMap, yIpfsConnector, yIndexeddb)

export default new Database()
