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

  initCommunity(communityId) {
    if (!this.communities.has(communityId)) {
      this.communities.set(communityId, this.initIPFS().then(node =>
        Y({
          db: {
            name: 'indexeddb'
          },
          connector: {
            name: 'ipfs',
            room: `thicket/${communityId}`,
            ipfs: node,
          },
          share: {
            publications: 'Array',
            publicationsMetadata: 'Map',
            metadata: 'Map'
          }
        }).then(y => {
          y.share.metadata.observe(() => this.emit('update'))
          y.share.publications.observe(() => this.emit('update'))
          y.share.publicationsMetadata.observe(() => this.emit('update'))

          return y
        })
      ))
    }
    return this.communities.get(communityId)
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

  publicationsDelete = (communityId, id) => {
    return new Promise((resolve, reject) =>
      this.initCommunity(communityId).then(y => {
        y.share.publications.delete(y.share.publications.toArray().findIndex(p => p === id))
        this.unlink(id, resolve)
      })
    )}

  publicationsMap = (communityId, data) => {
    return new Promise((resolve, reject) => {
      this.initCommunity(communityId).then(y => {
        this.initIPFS().then(node => {
          pull(
            pull.values(data),
            pullPromise.through(hash => node.files.cat(hash).then(stream => ({ hash, stream }))),
            pullPromise.through(({ hash, stream }) => new Promise(r => stream.pipe(concat(src => r({ hash, src }))))),
            pull.map(({ hash, src }) => ({ id: hash, src: toBase64(src), ...y.share.publicationsMetadata.get(hash) })),
            pull.collect((err, res) => resolve(res)),
          )
        })
      })
    })
  }

  publicationsGet = (communityId, id) =>
    this.publicationsGetAll(communityId, [id]).then(res => res[0])

  publicationsGetAll = (communityId, ids = []) =>
    this.initCommunity(communityId)
      .then(y => y.share.publications.toArray())
      .then(data => data.filter(id => !ids.length || ids.includes(id)))
      .then(data => this.publicationsMap(communityId, data))
      .then(data => data.sort((a, b) => b.createdAt - a.createdAt))

  publicationsPost = (communityId, { src, ...data }) =>
    this.initIPFS().then(node =>
      node.files
        .add(Buffer.from(new ImageDataConverter(src).convertToTypedArray()))
        .then(res =>
          this.initCommunity(communityId).then(y => {
            const id = res[0].hash
            y.share.publications.push([id])
            y.share.publicationsMetadata.set(id, { ...data, createdAt: Date.now() })
          })
        )
      )

  publicationsPut = (communityId, id, data) =>
    this.initCommunity(communityId).then(y =>
      y.share.publicationsMetadata.set(id, { ...y.share.publicationsMetadata.get(id), ...data }))

  communityDelete = id => {
    return this.initCommunity(id).then(y => {
      // async remove all local publications
      y.share.publications.toArray().forEach(hash => this.unlink(hash))
      // leave room
      return y.destroy()
    })
  }

  communityGet = communityId =>
    this.initCommunity(communityId)
      .then(y => y.share.metadata.get(communityId))
      .then(data => { return { id: communityId, title: '', ...data }})

  communityPost = (communityId, data) =>
    this.initCommunity(communityId).then(y => y.share.metadata.set(communityId, { ...data, createdAt: Date.now() }))

  communityPut = (communityId, data) =>
    this.initCommunity(communityId).then(y => y.share.metadata.set(communityId, { ...y.share.metadata.get(communityId), ...data }))
}

Y.extend(yMemory, yArray, yMap, yIpfsConnector, yIndexeddb)

class DBInterface extends EventEmitter {
  constructor() {
    super()
    this.db = new Database()
    this.db.on('update', () => this.emit('update'))
  }

  community(communityId) {
    if (!communityId) {
      throw new Error('Please provide a Community Id')
    }
    const { db } = this
    return {
      // community
      delete: () => db.communityDelete(communityId),
      get: () => db.communityGet(communityId),
      post: data => db.communityPost(communityId, data),
      put: data => db.communityPut(communityId, data),
      // publications
      get publications() {
        return {
          delete: id => db.publicationsDelete(communityId, id),
          get: id => db.publicationsGet(communityId, id),
          getAll: id => db.publicationsGetAll(communityId, id),
          post: data => db.publicationsPost(communityId, data),
          put: (id, data) => db.publicationsPut(communityId, id, data),
        }
      }
    }
  }
}

export default new DBInterface()
