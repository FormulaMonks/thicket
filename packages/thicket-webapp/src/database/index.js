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
import concat from 'concat-stream'

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

// IPFS team has not yet implemented a timeout/cancel feature on fetching files
// if we try to fetch a file that is not in the reach of this node/peer this call will never finish/complete
// read more here
// https://github.com/ipfs/js-ipfs/issues/800#issuecomment-290988388
const timedPromiseConcatStream = async ({ hash, stream }) => Promise.race([
  new Promise(r => setTimeout(() => r(`https://ipfs.io/ipfs/${hash}`), 1000)),
  new Promise(r => stream.pipe(concat(src => r(toBase64(src)))))
])

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
        const y = await Y(yConfig(node, communityId))
        // updates to the community metadata (eg change community title)
        y.share.metadata.observe(({ value }) => this.emit(`update-${communityId}`, value))
        // updates to the publications (eg new publication)
        y.share.publications.observe(async () => {
          const data = await this.publicationsGetAll(communityId)
          this.emit(`update-${communityId}-publications`, data)
        })
        // updates to publications metadata (eg change publication caption)
        y.share.publicationsMetadata.observe(({ value }) => this.emit(`update-${communityId}-publicationsMetadata`, value))

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
    this._unlink(id)
  }

  publicationsGet = async (communityId, id) => {
    const node = await this._initIPFS()
    const y = await this._initCommunity(communityId)
    const stream = await node.files.cat(id)
    const src = await timedPromiseConcatStream({ hash: id, stream })
    return { id, src, ...y.share.publicationsMetadata.get(id) }
  }

  publicationsGetAll = async communityId => {
    const y = await this._initCommunity(communityId)
    const data = y.share.publications.toArray()
    const publications = await Promise.all(data.map(async id => this.publicationsGet(communityId, id)))
    return publications.sort((a, b) => b.createdAt - a.createdAt)
  }

  publicationsPost = async (communityId, { src, ...data }) => {
    const node = await this._initIPFS()
    const res = await node.files.add(Buffer.from(new ImageDataConverter(src).convertToTypedArray()))
    const id = res[0].hash
    const y = await this._initCommunity(communityId)
    y.share.publications.push([id])
    y.share.publicationsMetadata.set(id, { ...data, createdAt: Date.now() })
  }

  publicationsPut = async (communityId, id, data) => {
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
      ...y.share.metadata.get(communityId)
    }
  }

  communityPost = async (communityId, data) => {
    const y = await this._initCommunity(communityId)
    y.share.metadata.set(communityId, { ...data, createdAt: Date.now() })
  }

  communityPut = async (communityId, data) => {
    const y = await this._initCommunity(communityId)
    y.share.metadata.set(communityId, { ...y.share.metadata.get(communityId), ...data })
  }

}

Y.extend(yMemory, yArray, yMap, yIpfsConnector, yIndexeddb)

export default new Database()
