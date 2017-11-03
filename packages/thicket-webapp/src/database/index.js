import IPFS from 'ipfs'
import ImageDataConverter from '../utils/imageDataConverter'
import Y from 'yjs'
import yMemory from 'y-memory'
import yIndexeddb from 'y-indexeddb'
import yArray from 'y-array'
import yMap from 'y-map'
import yIpfsConnector from 'y-ipfs-connector'
import EventEmitter from 'eventemitter3'

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

  publicationsGet = community =>
    this.initCommunity(community).then(y => y.share.publications.toArray())

  metadataPost = (community, data) =>
    this.initCommunity(community).then(y => y.share.metadata.set(community, data))

  metadataGet = community =>
    this.initCommunity(community).then(y => y.share.metadata.get(community))
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
      post: this.db.publicationsPost,
      get: this.db.publicationsGet,
    }
  }

  get metadata() {
    return {
      post: this.db.metadataPost,
      get: this.db.metadataGet,
    }
  }
}

export default new DBInterface()
