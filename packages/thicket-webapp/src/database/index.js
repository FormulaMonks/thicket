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

const ipfsConfig = {
  repo: 'thicket',
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ],
    },
  },
}

const yConfig = (node, user_id, id) => ({
  db: {
    name: 'indexeddb'
  },
  connector: {
    name: 'ipfs',
    room: `thicket:${id}`,
    ipfs: node,
    role: 'slave',
    syncMethod: 'syncAll',
    user_id,
  },
  share: {
    publications: 'Array',
    publicationsMetadata: 'Map',
    metadata: 'Map',
    nicknames: 'Map',
  }
})

const isSynced = y =>
  // if there are peers and they have all been synced
  y.connector.isSynced
  // no connections, only node/peer in this Community
  || (!Object.keys(y.connector.connections).length && y.connected)

const toBase64 = src =>
  `data:image/gif;base64,${btoa(new Uint8Array(src).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`

// IPFS team has not yet implemented a timeout/cancel feature on fetching files
// if we try to fetch a file that is not in the reach of this node/peer this call will never finish/complete
// read more here
// https://github.com/ipfs/js-ipfs/issues/800#issuecomment-290988388
const timedSrcCat = async (node, id) => Promise.race([
  new Promise(r => setTimeout(() => r(`https://ipfs.io/ipfs/${id}`), 3000)),
  new Promise(async r => {
    const stream = await node.files.cat(id)
    r(toBase64(stream))
  })
])

const mapIPFSIdstoNicknames = async(node, y) => {
  const { id } = await node.id()
  const nickname = (y.share && y.share.nicknames && y.share.nicknames.get(id)) || ''
  const peers = y.connector.roomEmitter.peers().reduce((p, c) => {
    if (y.share.nicknames.get(c)) {
      p.push(y.share.nicknames.get(c))
    }
    return p
  }, [])
  return [nickname, ...peers]
}

class Database extends EventEmitter {
  constructor() {
    super()
    this._ipfs = null
    this._communities = new Map()
    this._initIPFS()
  }

  _initIPFS() {
    if (!this._ipfs) {
      this._ipfs = new Promise((resolve, reject) => {
        const node = new IPFS(ipfsConfig)
        node.once('ready', () => resolve(node))
      })
    }
    return this._ipfs
  }

  async _initCommunity(communityId) {
    if (!communityId) {
      throw new Error('Please provide a Community Id')
    }
    if (!this._communities.has(communityId)) {
      const promise = new Promise(async resolve => {
        const node = await this._initIPFS()
        const { id: peerId } = await node.id()
        const y = await Y(yConfig(node, peerId, communityId))
        // updates to the community metadata (eg change community title)
        y.share.metadata.observe(({ value }) => {
          if (isSynced(y)) {
            this.emit(`update-${communityId}`, value)
          }
        })
        // updates to the publications (eg new publication)
        y.share.publications.observe(async () => {
          if (isSynced(y)) {
            this.emit(`update-${communityId}-publications`, await this.publicationsGetAll(communityId))
          }
        })
        // updates to publications metadata (eg change publication caption)
        y.share.publicationsMetadata.observe(({ value: { id, ...data }, type }) => {
          if (type === 'add' && isSynced(y)) {
            this.emit(`update-${communityId}-publicationsMetadata`, {
              id,
              ...y.share.publicationsMetadata.get(id),
              ...data
            })
          }
        })
        // nicknames: IPFS node id <-> nickname
        y.share.nicknames.observe(async () => {
          if (isSynced(y)) {
            this.emit(`peer-${communityId}`, await mapIPFSIdstoNicknames(node, y))
          }
        })
        // online peers
        y.connector.onUserEvent(async ({ action }) => {
          this.emit(`peer-${communityId}`, await mapIPFSIdstoNicknames(node, y))
          // syncing
          if (action === 'userJoined') {
            this.emit(`syncing-${communityId}`)
            y.connector.whenSynced(() => this.emit(`synced-${communityId}`))
          }
        })

        resolve(y)
      })
      this._communities.set(communityId, promise)
    }
    return this._communities.get(communityId)
  }

  _unlink = async hash => {
    // unlink from local storage
    const node = await this._initIPFS()
    const { value: { links } } = await node.dag.get(new CID(hash))
    // all blocks from this hash
    links.forEach(link => node._ipldResolver.bs.delete(new CID(link.multihash)))
    // then the actual block for id
    node._ipldResolver.bs.delete(new CID(hash))
  }

  publicationsDelete = async (communityId, id) => {
    const y = await this._initCommunity(communityId)
    y.share.publications.delete(y.share.publications.toArray().findIndex(p => p === id))
    y.share.publicationsMetadata.delete(id)
    this._unlink(id)
  }

  publicationsGet = async (communityId, id) => {
    const node = await this._initIPFS()
    const y = await this._initCommunity(communityId)
    const src = await timedSrcCat(node, id)
    return { id, src, ...y.share.publicationsMetadata.get(id) }
  }

  publicationsGetAll = async communityId => {
    const y = await this._initCommunity(communityId)
    const data = y.share.publications.toArray()
    const publications = await Promise.all(data.map(async id => this.publicationsGet(communityId, id)))
    return publications.sort((a, b) => b.createdAt - a.createdAt)
  }

  publicationsGetMetadata = async communityId => {
    const y = await this._initCommunity(communityId)
    return y.share.publications.toArray().map(id => ({
      id,
      ...y.share.publicationsMetadata.get(id)
    }))
  }

  publicationsPost = async (communityId, { src, ...data }) => {
    const node = await this._initIPFS()
    const res = await node.files.add(Buffer.from(new ImageDataConverter(src).convertToTypedArray()))
    const id = res[0].hash
    const y = await this._initCommunity(communityId)
    y.share.publications.push([id])
    y.share.publicationsMetadata.set(id, { id, ...data, createdAt: Date.now() })
  }

  publicationsPostByHash = async(communityId, { hash, ...data }) => {
    const y = await this._initCommunity(communityId)
    y.share.publications.push([hash])
    y.share.publicationsMetadata.set(hash, { id: hash, ...data, createdAt: Date.now() })
  }

  publicationsPut = async (communityId, id, { src, ...data }) => {
    const y = await this._initCommunity(communityId)
    y.share.publicationsMetadata.set(id, { ...y.share.publicationsMetadata.get(id), ...data })
  }

  communityDelete = async communityId => {
    const y = await this._initCommunity(communityId)
    // async remove all local publications
    y.share.publications.toArray().forEach(this._unlink)
    // leave room
    return y.destroy()
  }

  communityGet = async communityId => {
    const y = await this._initCommunity(communityId)
    return {
      id: communityId,
      title: '',
      size: 0,
      ...y.share.metadata.get(communityId)
    }
  }


  communityGetOnlinePeers = async communityId => {
    const node = await this._initIPFS()
    const y = await this._initCommunity(communityId)
    const peers = await mapIPFSIdstoNicknames(node, y)
    return peers
  }

  communityPost = async (communityId, data) => {
    const y = await this._initCommunity(communityId)
    y.share.metadata.set(communityId, { ...data, createdAt: Date.now() })
  }

  communityPut = async (communityId, data) => {
    const y = await this._initCommunity(communityId)
    y.share.metadata.set(communityId, { ...y.share.metadata.get(communityId), ...data })
  }

  communityPutNicknames = async (communities, data) => {
    for (let communityId of communities) {
      const y = await this._initCommunity(communityId)
      const node = await this._initIPFS()
      const { id } = await node.id()
      y.share.nicknames.set(id, data)
    }
  }

}

Y.extend(yMemory, yArray, yMap, yIpfsConnector, yIndexeddb)

export default new Database()
