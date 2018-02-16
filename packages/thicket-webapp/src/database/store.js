import EventEmitter from 'eventemitter3'
import localForage from 'localforage'
import db, { sortPublications } from './index.js'

const state = {
  user: {
    nickname: `Guest${Math.floor(1 + Math.random() * 1000)}`,
  },
  userCommunities: new Set(),
  communities: new Map()
}

/*
 * This class will take care of requests for data
 * if there is data cached it will return such
 * if there is no cached data it will fetch it from db
 * whenever an update is emitted from the db this will update the cached data
 * */
class Publications extends EventEmitter {
  constructor(communityId) {
    if (!communityId) {
      throw new Error('Please provide a Community Id')
    }

    super()
    this.communityId = communityId
    this.list = []

    // updates from db
    db.on(`update-${communityId}-publications`, list => {
      this.list = list
      this.emit('update')
    })
    db.on(`update-${communityId}-publicationsMetadata`, data => {
      if (!this.list.find(i => i.id === data.id)) {
        this.list = [...this.list, data]
      }
      this.list = this.list
        .map(p => p.id !== data.id ? p : { ...p, ...data })
        .sort(sortPublications)
      this.emit('update')
    })
    db.on(`synced-${communityId}`, () => {
      // bust cache - not actually busting the list but making sure
      // next fetch goes to db
      this._fetchedAll = false
    })
  }

  delete = id => db.publicationsDelete(this.communityId, id)

  get = async id => {
    const cached = this.list.find(p => p.id === id)
    if (cached) {
      return Promise.resolve(cached)
    }
    const publication = await db.publicationsGet(this.communityId, id)
    if (publication) {
      this.list.push(publication)
    }
    return publication
  }

  getAll = async () => {
    if (!this._fetchedAll) {
      this.list = await db.publicationsGetAll(this.communityId)
      this._fetchedAll = true
    }
    return this.list
  }

  getSize = () => {
    return this.list.reduce((p, c) => p + ((c.src && c.src.length) || 0), 0)
  }

  getMetadata = async () => {
    return await db.publicationsGetMetadata(this.communityId)
  }

  post = data => db.publicationsPost(this.communityId, data)

  postByHash = data => db.publicationsPostByHash(this.communityId, data)

  put = (id, data) => db.publicationsPut(this.communityId, id, data)

}

/*
 * This class will take care of requests for data
 * if there is data cached it will return such
 * if there is no cached data it will fetch it from db
 * whenever an update is emitted from the db this will update the cached data
 * */
class Community extends EventEmitter {
  constructor(communityId) {
    super()
    this.communityId = communityId
    this.data = null
    this.onlinePeers = null

    // listen to updates from db
    db.on(`update-${communityId}`, data => {
      this.data = data
      this.emit('update')
    })
    db.on(`peer-${communityId}`, peers => {
      this.onlinePeers = peers
      this.emit('peer')
    })
    db.on(`synced-${communityId}`, () => {
      // bust local cache
      this.onlinePeers = null
      this.data = null
      this.emit('synced')
    })
    db.on(`syncing-${communityId}`, () => this.emit('syncing'))

    // publications
    this.publications = new Publications(communityId)
  }

  delete = () => db.communityDelete(this.communityId)

  // passthrough method
  deletePublication = async id => {
    // side effect
    // when a GIF gets deleted we need to update the Community size
    const { src } = await this.publications.get(id)
    this.data.size = this.publications.getSize() - src.length
    // delete
    return this.publications.delete(id)
  }

  get = async () => {
    if (!this.data) {
      this.data = await db.communityGet(this.communityId)
      this.data.size = this.publications.getSize()
    }
    return this.data
  }

  // passthrough method to calculate community size based on sum of
  // publications individual sizes
  getAllPublications = async () => {
    const list = await this.publications.getAll()
    this.data.size = this.publications.getSize()
    return list
  }

  getOnlinePeers = async () => {
    if (!this.onlinePeers) {
      this.onlinePeers = await db.communityGetOnlinePeers(this.communityId)
    }
    return this.onlinePeers
  }

  post = data => db.communityPost(this.communityId, data)

  // passthrough method
  postPublication = data => {
    // side effect
    // when a new gif is posted we calculate its size and add it to the Community size
    this.data.size = this.publications.getSize() + data.src.length
    // post
    return this.publications.post(data)
  }

  put = data => db.communityPut(this.communityId, data)

}

class EventEmitterCommunities extends EventEmitter {
  constructor(ctx) {
    super()

    // user communities
    this.delete = async id => {
      await ctx._initCommunities()
      const community = await this.get(id)
      community.delete()
      state.userCommunities.delete(id)
      const newArray = Array.from(state.userCommunities)
      localForage.setItem('userCommunities', newArray)
      this.emit('update', newArray)
    }

    this.getAll = async () => {
      await ctx._initCommunities()
      return Array.from(state.userCommunities).reverse()
    }

    this.has = async id => {
      await ctx._initCommunities()
      return state.userCommunities.has(id)
    }

    this.post = async id => {
      await ctx._initCommunities()
      state.userCommunities.add(id)
      state.communities.set(id, new Community(id))
      localForage.setItem('userCommunities', Array.from(state.userCommunities))
      // side effect
      // when a user joins a community we set the nickname information into the shared data
      db.communityPutNicknames([id], state.user.nickname)
      //
      this.emit('update', Array.from(state.userCommunities))
      return state.communities.get(id)
    }

    // communities
    this.get = async id => {
      await ctx._initCommunities()
      if (!state.communities.has(id)) {
        state.communities.set(id, new Community(id))
      }
      return state.communities.get(id)
    }
  }
}

class User extends EventEmitter {
  constructor() {
    super()
    this._initUser()
    this._initCommunities()
  }

  // user
  _initUser = async() => {
    if (!this._initUserPromise) {
      this._initUserPromise = new Promise(async resolve => {
        const local = await localForage.getItem('user')
        if (!local) {
          await localForage.setItem('user', state.user)
        }
        state.user = local || state.user
        resolve()
      })
    }
    return this._initUserPromise
  }

  get = async () => {
    await this._initUser()
    return state.user
  }

  put = async data => {
    await this._initUser()
    state.user = { ...state.user, ...data }
    await localForage.setItem('user', state.user)
    // side effect
    // when a user updates their nickname we broadcast this update to all the communities the user belongs to
    db.communityPutNicknames(state.userCommunities, state.user.nickname)
    // update
    this.emit('update')
  }

  // user communities & communities
  _initCommunities = async () => {
    if (!this._initCommunitiesPromise) {
      this._initCommunitiesPromise = new Promise(async resolve => {
        const list = await localForage.getItem('userCommunities')
        state.userCommunities = new Set(list)
        resolve()
      })
    }
    return this._initCommunitiesPromise
  }

  get communities() {
    if (!this._communities) {
      this._communities = new EventEmitterCommunities(this)
    }
    return this._communities
  }

  // subscribe to all communities
  // this helps redistribute content and data without need for the UI
  // to visit the related sections
  _subscribe = async () => {
    await this._initCommunities()
    for (const communityId of state.userCommunities) {
      // the next line will subscribe to the communities's rooms
      // thus becoming part of the swarm and redistributing the data
      // for the Array and Map y-elements
      const { publications } = await this.communities.get(communityId)
      // this is potentially terribly expensive
      // as it would get all publications for all communities
      // and one by one would store all the files locally
      // and in memory (state cache keeps the data source for gifs)
      publications.getAll()
    }
  }

  removeBlacklistedCommunities = async blacklist => {
    await this._initUser()
    await this._initCommunities()
    for (const communityId of state.userCommunities) {
      if (blacklist.includes(communityId)) {
        await this.communities.delete(communityId)
      }
    }
    // once we've finished removing malicious communities
    // let's subscribe, fetch and redistribute the rest
    this._subscribe()
  }

}

const user = new User()

const store = {
  user,
  // alias
  communities: user.communities,
}

export default store
