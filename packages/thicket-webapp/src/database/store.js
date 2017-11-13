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
    this.data = []

    // updates from db
    db.on(`update-${communityId}-publications`, data => {
      this.data = data
      this.emit('update')
    })
    db.on(`update-${communityId}-publicationsMetadata`, data => {
      this.data = this.data.map(p => p.id !== data.id ? p : data)
      this.emit('update')
    })
  }

  delete = id => db.publicationsDelete(this.communityId, id)
  
  get = id => {
    const cached = this.data.find(p => p.id === id)
    if (cached) {
      return Promise.resolve(cached)
    }
    return db.publicationsGet(this.communityId, id)
      .then(data => {
        this.data.push(data)
        return data
      })
  }
  
  getAll = () => {
    if (this._fetchedAll) {
      this._fetchedAll = true
      return Promise.resolve(this.data)
    }
    return db.publicationsGetAll(this.communityId)
      .then(data => {
        this.data = data
        return data
      })
  }
  
  post = data => db.publicationsPost(this.communityId, data)
  
  put = (id, data) => db.publicationsPut(this.communityId, id, data)
    .then(() => this.data = this.data.map(p => {
      if (p.id) {
        return { id, ...data }
      }
      return p
    }))
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
    this.delete = id => ctx.initCommunities()
      .then(() => this.get(id).then(community => community.delete()))
      .then(() => state.userCommunities.delete(id))
      .then(() => localForage.setItem('userCommunities', [...state.userCommunities]))
      .then(() => this.emit('update', [...state.userCommunities]))

    this.getAll = () => ctx.initCommunities().then(() => [...state.userCommunities])

    this.has = id => ctx.initCommunities().then(() => state.userCommunities.has(id))

    this.post = id => ctx.initCommunities()
      .then(() => state.userCommunities.add(id))
      .then(() => state.communities.set(id, new Community(id)))
      .then(() => localForage.setItem('userCommunities', [...state.userCommunities]))
      .then(() => this.emit('update', [...state.userCommunities]))

    // communities
    this.get = id => ctx.initCommunities()
      .then(() => { if (!state.communities.has(id)) state.communities.set(id, new Community(id)) })
      .then(() => state.communities.get(id))
  }
}

class User extends EventEmitter {
  constructor() {
    super()
    this.initUser()
    this.initCommunities()
  }

  // user
  initUser() {
    if (!this.user) {
      this.user = localForage.getItem('user').then(v => state.user = v || state.user)
    }
    return this.user
  }

  get = () => this.initUser().then(() => state.user)
  
  put = data => this.initUser()
    .then(() => state.user = { ...state.user, ...data })
    .then(() => localForage.setItem('user', state.user))
    .then(() => this.emit('update'))
  
  // user communities & communities
  initCommunities() {
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
}

const user = new User()

const store = {
  user,
  // alias
  communities: user.communities,
}

export default store
