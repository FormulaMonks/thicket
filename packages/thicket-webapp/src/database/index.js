import IPFS from 'ipfs'
import ImageDataConverter from '../utils/imageDataConverter'
import Y from 'yjs'
import yMemory from 'y-memory'
import yIndexeddb from 'y-indexeddb'
import yArray from 'y-array'
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
    if (this.ipfs) {
      return Promise.resolve(this.ipfs)
    }

    return new Promise((resolve, reject) => {
      this.ipfs = new IPFS(config)
      this.ipfs.once('ready', () => resolve(this.ipfs))
    })
  }

  initCommunity(community) {
    if (this.communities.has(community)) {
      return this.communities.get(community)
    }
    
    return Y({
      db: { name: 'indexeddb' },
      connector: {
        name: 'ipfs',
        room: `thicket/${community}`,
        ipfs: this.ipfs
      },
      share: { publications: 'Array' }
    }).then(y => {
      this.communities.set(community, y)
      y.share.publications.observe(() => this.emit('update'))
      this.emit('update')
      return y
    })
  }

  push = ({ src, nickname, caption, community }) => {
    return this.initIPFS().then(ipfs =>
      ipfs.files
        .add(Buffer.from(new ImageDataConverter(src).convertToTypedArray()))
        .then(res =>
          this.initCommunity(community).then(y =>
            y.share.publications.push([{
              id: res[0].hash,
              createdAt: Date.now(),
              nickname,
              caption,
            }])
          )
        )
      )
  }
}

Y.extend(yMemory, yArray, yIpfsConnector, yIndexeddb)
const db = new Database()

export default { push: db.push }
