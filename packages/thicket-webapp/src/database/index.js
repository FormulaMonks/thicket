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
import { DEFAULT_PUBLICATIONS, TIMEOUT } from '../utils/constants'

export const sortPublications = (a, b) => b.createdAt - a.createdAt

const { REACT_APP_SWARM: SWARM='WRTC_IPFS' } = process.env
const Swarm = SWARM === 'WRTC_LOCAL'
  ? ['/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star']
  : SWARM === 'WSIO_LOCAL'
    ? ['/ip4/127.0.0.1/tcp/9191/ws/p2p-websocket-star']
    : SWARM === 'WSIO_IPFS'
      ? ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/']
      : ['/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star']

const ipfsConfig = {
  repo: 'thicket',
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: { Swarm },
    Bootstrap: []
  },
}

const yConfig = (node, id) => ({
  db: {
    name: 'indexeddb'
  },
  connector: {
    name: 'ipfs',
    room: `thicket-${id}`,
    ipfs: node,
    syncMethod: 'syncAll',
  },
  share: {
    publications: 'Map',
    publicationsMetadata: 'Map',
    metadata: 'Map',
    nicknames: 'Map',
  }
})

const toBase64 = src =>
  `data:image/gif;base64,${btoa(new Uint8Array(src).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`

// IPFS team has not yet implemented a timeout/cancel feature on fetching files
// if we try to fetch a file that is not in the reach of this node/peer this call will never finish/complete
// read more here
// https://github.com/ipfs/js-ipfs/issues/800#issuecomment-290988388
const timedSrcCat = async (node, id) => Promise.race([
  new Promise(r => setTimeout(() => r(''), TIMEOUT)),
  new Promise(async r => {
    const stream = await node.files.cat(id)
    r(toBase64(stream))
  })
])

const mapIPFSIdstoNicknames = async ({ share, connector }) => {
  return (share && share.nicknames)
    ? Object.keys(connector.connections).reduce((p, c) => {
      if (share.nicknames.get(c)) {
        p.push(share.nicknames.get(c))
      }
      return p
    }, [])
    : []
}

const getDataSrcFromURL = async path => new Promise(r => {
  const request = new XMLHttpRequest()
  request.open('GET', path, true)
  request.responseType = 'blob'
  request.onload = () => {
    const reader = new FileReader()
    reader.readAsDataURL(request.response)
    reader.onload = e => r(e.target.result)
  }
  request.send()
})

class Database extends EventEmitter {
  constructor(opts) {
    super()
    this._ipfs = null
    this._communities = new Map()
    this._syncing = false
    this._opts = { ...ipfsConfig, ...opts }
  }

  _initIPFS() {
    if (!this._ipfs) {
      this._ipfs = new Promise(r => {
        const node = new IPFS(this._opts)
        node.once('ready', () => r(node))
      })
    }
    return this._ipfs
  }

  _initCommunity(communityId) {
    if (!communityId) {
      throw new Error('Please provide a Community Id')
    }
    if (!this._communities.has(communityId)) {
      const promise = new Promise(async r => {
        const node = await this._initIPFS()
        const y = await Y(yConfig(node, communityId))
        // updates to the community metadata (eg change community title)
        y.share.metadata.observe(({ value, type }) => {
          if (value && type !== 'delete') {
            if (!this._syncing) {
              this.emit(`update-${communityId}`, value)
            }
          }
        })
        // updates to the publications (eg new publication)
        y.share.publications.observe(async ({ type, name }) => {
          if (!this._syncing) {
            this.emit(`update-${communityId}-publications`, await this.publicationsGetAll(communityId))
          }
          // async remove local blocks
          if (type === 'delete') {
            this._unlink(name)
          }
        })
        // updates to publications metadata (eg change publication caption)
        y.share.publicationsMetadata.observe(() => {
          if (!this._syncing) {
            const list = y.share.publicationsMetadata.keys()
              .map(k => ({ ...y.share.publicationsMetadata.get(k) }))
            this.emit(`update-${communityId}-publicationsMetadata`, list)
          }
        })
        // nicknames: IPFS node id <-> nickname
        y.share.nicknames.observe(async () => {
          if (!this._syncing) {
            this.emit(`peer-${communityId}`, await mapIPFSIdstoNicknames(y))
          }
        })
        // online peers
        y.connector.onUserEvent(async ({ action }) => {
          this.emit(`peer-${communityId}`, await mapIPFSIdstoNicknames(y))
          // syncing
          if (action === 'userJoined') {
            this._syncing = true
            this.emit(`syncing-${communityId}`)
            y.connector.whenSynced(() => {
              setTimeout(() => {
                this._syncing = false
                this.emit(`synced-${communityId}`)
              }, 1000)
            })
          }
        })

        r(y)
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
    links.forEach(link => node._ipld.bs.delete(new CID(link.multihash)))
  }

  publicationsDelete = async (communityId, id) => {
    const y = await this._initCommunity(communityId)
    const promise = new Promise(r => {
      const once = () => {
        y.share.publications.unobserve(once)
        r()
      }
      y.share.publications.observe(once)
    })
    y.share.publications.delete(id)
    y.share.publicationsMetadata.delete(id)
    this._unlink(id)
    return promise
  }

  publicationsGet = async (communityId, id) => {
    const y = await this._initCommunity(communityId)
    // onboarding gifs
    const exists = DEFAULT_PUBLICATIONS.find(p => p.hash === id)
    const metadata = (y.share && y.share.publicationsMetadata && y.share.publicationsMetadata.get(id)) || {}
    if (exists) {
      const { hash, path, ...rest } = exists
      return { id, ...metadata, src: await getDataSrcFromURL(path), ...rest }
    }
    // ipfs
    const node = await this._initIPFS()
    const src = await timedSrcCat(node, id)
    return { id, src, ...metadata }
  }

  publicationsGetAll = async communityId => {
    const y = await this._initCommunity(communityId)
    const data = y.share.publications.keys()
    const publications = await Promise.all(data.map(async id =>
      this.publicationsGet(communityId, id)))
    return publications.sort(sortPublications)
  }

  publicationsGetMetadata = async communityId => {
    const y = await this._initCommunity(communityId)
    const data = y.share.publications.keys()
    return data.map(id => {
      const metadata = (y.share && y.share.publicationsMetadata && y.share.publicationsMetadata.get(id)) || {}
      return { id, ...metadata }
    }).sort(sortPublications)
  }

  publicationsPost = async (communityId, { src, ...data }) => {
    const node = await this._initIPFS()
    const res = await node.files.add(Buffer.from(new ImageDataConverter(src).convertToTypedArray()))
    const id = res[0].hash
    const y = await this._initCommunity(communityId)
    const promise = new Promise(r => {
      const once = () => {
        y.share.publications.unobserve(once)
        r()
      }
      y.share.publications.observe(once)
    })
    y.share.publications.set(id)
    y.share.publicationsMetadata.set(id, { id, ...data, createdAt: Date.now() })
    return promise
  }

  publicationsPostByHash = async(communityId, { hash, ...data }) => {
    const y = await this._initCommunity(communityId)
    y.share.publications.set(hash)
    y.share.publicationsMetadata.set(hash, { id: hash, ...data, createdAt: Date.now() })
  }

  publicationsPut = async (communityId, id, { src, ...data }) => {
    const y = await this._initCommunity(communityId)
    y.share.publicationsMetadata.set(id, { ...y.share.publicationsMetadata.get(id), ...data })
  }

  communityDelete = async communityId => {
    const y = await this._initCommunity(communityId)
    // async remove all local publications
    y.share.publications.keys().forEach(this._unlink)
    // leave room
    y.close()
  }

  communityGet = async communityId => {
    const y = await this._initCommunity(communityId)
    const metadata = (y.share && y.share.metadata && y.share.metadata.get(communityId)) || {}
    return {
      id: communityId,
      title: '',
      ...metadata,
    }
  }

  communityGetOnlinePeers = async communityId => {
    const y = await this._initCommunity(communityId)
    return await mapIPFSIdstoNicknames(y)
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
    for (const communityId of communities) {
      const { share } = await this._initCommunity(communityId)
      if (share && share.nicknames) {
        const node = await this._initIPFS()
        const { id } = await node.id()
        const current = share.nicknames.get(id)
        if (data !== current) {
          share.nicknames.set(id, data)
        }
      }
    }
  }

}

Y.extend(yMemory, yArray, yMap, yIpfsConnector, yIndexeddb)

export default Database
