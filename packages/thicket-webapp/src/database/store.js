import EventEmitter from 'eventemitter3'
import localForage from 'localforage'
import db from './index.js'

const state = {
  user: {
    nickname: `Guest${Math.floor(1 + Math.random() * 1000)}`,
    onboarding: null,
    hasDoneFirstGIF: false,
    hasDoneCommunityOnboarding: false
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
      this.list = this.list.map(p => p.id !== data.id ? p : data)
      this.emit('update')
    })
  }

  delete = id => {
    this.list = this.list.filter(p => p.id === id)
    return db.publicationsDelete(this.communityId, id)
  }

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

  getAll = () => this._fetchedAll
    ? Promise.resolve(this.list)
    : db.publicationsGetAll(this.communityId)
        .then(list => {
          this._fetchedAll = true
          this.list = list
          return list
        })

  post = data => db.publicationsPost(this.communityId, data)

  put = (id, data) => db.publicationsPut(this.communityId, id, data)
    .then(() => this.list = this.list.map(p => p.id === id ? { id, ...data } : p))

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

    // listen to updates from db
    db.on(`update-${communityId}`, data => {
      this.data = data
      this.emit('update')
    })

    // publications
    this.publications = new Publications(communityId)
  }

  delete = () => db.communityDelete(this.communityId)

  get = () => this.data
    ? Promise.resolve(this.data)
    : db.communityGet(this.communityId).then(data => this.data = data)

  post = data => db.communityPost(this.communityId, data)

  put = data => db.communityPut(this.communityId, data)
}

class EventEmitterCommunities extends EventEmitter {
  constructor(ctx) {
    super()

    // user communities
    this.delete = async id => {
      await ctx._initCommunities()
      const community = await this.get(id)
      await community.delete()
      state.userCommunities.delete(id)
      localForage.setItem('userCommunities', Array.from(state.userCommunities))
      this.emit('update', Array.from(state.userCommunities))
    }

    this.getAll = async () => {
      await ctx._initCommunities()
      return Array.from(state.userCommunities)
    }

    this.has = id => ctx._initCommunities().then(() => state.userCommunities.has(id))

    this.post = async id => {
      await ctx._initCommunities()
      state.userCommunities.add(id)
      state.communities.set(id, new Community(id))
      await localForage.setItem('userCommunities', Array.from(state.userCommunities))
      this.emit('update', Array.from(state.userCommunities))
      return state.communities.get(id)
    }

    // communities
    this.get = id => ctx._initCommunities()
      .then(() => { if (!state.communities.has(id)) state.communities.set(id, new Community(id)) })
      .then(() => state.communities.get(id))
  }
}

class User extends EventEmitter {
  constructor() {
    super()
    this._initUser()
    this._initCommunities()
    this._subscribe()
  }

  // user
  _initUser() {
    if (!this.user) {
      this.user = localForage.getItem('user').then(v => state.user = v || state.user)
    }
    return this.user
  }

  get = async () => {
    await this._initUser()
    return state.user
  }

  put = async data => {
    await this._initUser()
    state.user = { ...state.user, ...data }
    await localForage.setItem('user', state.user)
    this.emit('update')
  }

  // user communities & communities
  _initCommunities() {
    if (!this.userCommunities) {
      this.userCommunities = localForage.getItem('userCommunities').then(v => state.userCommunities = new Set(v || []))
    }
    return this.userCommunities
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
  _subscribe() {
    this._initCommunities().then(() => {
      for (const communityId of state.userCommunities) {
        // the next line will subscribe to the communities's rooms
        // thus becoming part of the mesh and redistributing the data
        // for the Array and Map y-elements
        this.communities.get(communityId)
          // this is potentially terribly expensive
          // as it would get all publications for all communities
          // and one by one would store all the files locally
          // and in memory (state cache keeps the data source for gifs)
          .then(({ publications }) => publications.getAll())
      }
    })
  }

}

const user = new User()

const store = {
  user,
  // alias
  communities: user.communities,
}

export default store
