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

const config = {
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
}

const toBase64 = src =>
  `data:image/gif;base64,${btoa(new Uint8Array(src).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`

class Database extends EventEmitter {
  constructor() {
    super()
    this.ipfs = null
    this.communities = new Map()
    this.initIPFS()
  }

  initIPFS() {
    if (!this.ipfs) {
      this.ipfs = new Promise((resolve, reject) => {
        const node = new IPFS(config)
        node.once('ready', () => resolve(node))
      })
    }
    return this.ipfs
  }

  initCommunity(community) {
    if (!this.communities.has(community)) {
      this.communities.set(community, this.initIPFS().then(node =>
        Y({
          db: {
            name: 'indexeddb'
          },
          connector: {
            name: 'ipfs',
            room: `thicket/${community}`,
            ipfs: node,
          },
          share: {
            publications: 'Array',
            metadata: 'Map'
          }
        }).then(y => {
          y.share.metadata.observe(() => this.emit('update'))
          y.share.publications.observe(() => this.emit('update'))
          return y
        })
      ))
    }
    return this.communities.get(community)
  }

  unlink = (hash, cb = () => {}) =>
    // unlink from local storage
    this.initIPFS().then(node =>
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

  publicationsDelete = (community, id) => {
    return new Promise((resolve, reject) =>
      this.initCommunity(community).then(y => {
        y.share.publications.delete(y.share.publications.toArray().findIndex(p => p.id === id))
        this.unlink(id, resolve)
      })
    )}

  publicationsGet = (community, ids = []) =>
    this.initCommunity(community)
      .then(y => y.share.publications.toArray())
      .then(data => data.filter(p => !ids.length || ids.includes(p.id)))
      .then(this.publicationsMap)
      .then(data => data.sort((a, b) => b.createdAt - a.createdAt))

  publicationsMap = data => {
    return new Promise((resolve, reject) => {
      this.initIPFS().then(node => {
        pull(
          pull.values(data),
          pullPromise.through(p => node.files.cat(p.id).then(stream => { return { ...p, stream }})),
          pullPromise.through(({ stream, ...rest }) => new Promise(r => stream.pipe(concat(src => r({ ...rest, src }))))),
          pull.map(obj => ({ ...obj, src: toBase64(obj.src) })),
          pull.collect((err, res) => resolve(res)),
        )
      })
    })
  }

  publicationsPost = (community, { src, ...data }) =>
    this.initIPFS().then(node =>
      node.files
        .add(Buffer.from(new ImageDataConverter(src).convertToTypedArray()))
        .then(res =>
          this.initCommunity(community).then(y =>
            y.share.publications.push([{
              ...data,
              id: res[0].hash,
              createdAt: Date.now(),
            }])
          )
        )
      )

  // not implemented in YJS
  // thus, put implies delete & insert
  // https://github.com/y-js/yjs/issues/16
  publicationsPut = (c, id, data) =>
    this.publicationsDelete(c, id)
      .then(() => this.publicationsPost(c, data))

  metadataGet = community =>
    this.initCommunity(community)
      .then(y => y.share.metadata.get(community))
      .then(data => { return { id: community, ...data }})
      .then(this.metadataMap)

  metadataMap = (data = {}) => {
    const { id, title = id, ...rest } = data
    return { id, title, ...rest }
  }

  metadataPost = (community, data) =>
    this.initCommunity(community).then(y => y.share.metadata.set(community, data))
}

Y.extend(yMemory, yArray, yMap, yIpfsConnector, yIndexeddb)

class DBInterface extends EventEmitter {
  constructor() {
    super()
    this.db = new Database()
    this.db.on('update', () => this.emit('update'))
  }

  get publications() {
    return {
      delete: this.db.publicationsDelete,
      get: this.db.publicationsGet,
      post: this.db.publicationsPost,
      put: this.db.publicationsPut,
    }
  }

  get metadata() {
    return {
      get: this.db.metadataGet,
      post: this.db.metadataPost,
    }
  }
}

export default new DBInterface()